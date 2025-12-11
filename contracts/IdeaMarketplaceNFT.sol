// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title IdeaMarketplaceNFT
 * @dev NFT contract for idea marketplace on Polygon
 * Each idea is represented as an NFT with image and metadata stored on IPFS
 */
contract IdeaMarketplaceNFT is ERC721URIStorage, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Marketplace fee (in basis points, e.g., 250 = 2.5%)
    uint256 public marketplaceFee = 250;
    address public feeRecipient;

    // Idea Metadata
    struct Idea {
        string title;
        string description;
        string category;
        string imageURI;        // IPFS hash of the uploaded image
        string metadataURI;     // Full metadata URI (IPFS JSON)
        address creator;
        address currentOwner;
        uint256 price;          // Price in MATIC (wei)
        uint256 createdAt;
        uint256 salesCount;
        bool isListed;
    }

    // Token ID => Idea
    mapping(uint256 => Idea) public ideas;
    
    // Creator address => array of token IDs
    mapping(address => uint256[]) public creatorIdeas;
    
    // Category => array of token IDs
    mapping(string => uint256[]) public categoryIdeas;

    // Track total sales volume
    uint256 public totalSalesVolume;

    // Events
    event IdeaCreated(
        uint256 indexed tokenId,
        address indexed creator,
        string title,
        string category,
        string imageURI,
        uint256 price
    );

    event IdeaListed(uint256 indexed tokenId, uint256 price);
    event IdeaUnlisted(uint256 indexed tokenId);
    event IdeaSold(
        uint256 indexed tokenId,
        address indexed from,
        address indexed to,
        uint256 price
    );
    event IdeaPriceUpdated(uint256 indexed tokenId, uint256 newPrice);
    event MarketplaceFeeUpdated(uint256 newFee);

    constructor(address _feeRecipient) ERC721("IdeaMarketplace", "IDEA") Ownable(msg.sender) {
        require(_feeRecipient != address(0), "Invalid fee recipient");
        feeRecipient = _feeRecipient;
    }

    /**
     * @dev Create a new idea NFT
     * @param title Title of the idea
     * @param description Detailed description of the idea
     * @param category Category (e.g., "Music", "Art", "Tech", "Business")
     * @param imageURI IPFS URI of the uploaded image (e.g., "ipfs://QmXxx...")
     * @param metadataURI IPFS URI of complete metadata JSON
     * @param price Price in MATIC (wei)
     * @return tokenId The ID of the newly minted NFT
     */
    function createIdea(
        string memory title,
        string memory description,
        string memory category,
        string memory imageURI,
        string memory metadataURI,
        uint256 price
    ) external returns (uint256) {
        require(bytes(title).length > 0, "Title required");
        require(bytes(description).length > 0, "Description required");
        require(bytes(category).length > 0, "Category required");
        require(bytes(imageURI).length > 0, "Image URI required");
        require(bytes(metadataURI).length > 0, "Metadata URI required");
        require(price > 0, "Price must be > 0");

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        // Mint NFT to creator
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, metadataURI);

        // Store idea metadata
        ideas[newTokenId] = Idea({
            title: title,
            description: description,
            category: category,
            imageURI: imageURI,
            metadataURI: metadataURI,
            creator: msg.sender,
            currentOwner: msg.sender,
            price: price,
            createdAt: block.timestamp,
            salesCount: 0,
            isListed: true
        });

        // Index by creator and category
        creatorIdeas[msg.sender].push(newTokenId);
        categoryIdeas[category].push(newTokenId);

        emit IdeaCreated(newTokenId, msg.sender, title, category, imageURI, price);

        return newTokenId;
    }

    /**
     * @dev Buy an idea NFT
     * @param tokenId Token ID to purchase
     */
    function buyIdea(uint256 tokenId) external payable nonReentrant {
        require(_exists(tokenId), "Token does not exist");
        Idea storage idea = ideas[tokenId];
        require(idea.isListed, "Idea not listed");
        require(msg.value >= idea.price, "Insufficient payment");
        require(ownerOf(tokenId) != msg.sender, "Cannot buy your own idea");

        address seller = ownerOf(tokenId);
        uint256 salePrice = idea.price;

        // Calculate fees
        uint256 fee = (salePrice * marketplaceFee) / 10000;
        uint256 sellerAmount = salePrice - fee;

        // Transfer NFT to buyer
        _transfer(seller, msg.sender, tokenId);

        // Update idea metadata
        idea.currentOwner = msg.sender;
        idea.salesCount += 1;
        idea.isListed = false;

        // Transfer payments
        (bool feeSuccess, ) = feeRecipient.call{value: fee}("");
        require(feeSuccess, "Fee transfer failed");

        (bool sellerSuccess, ) = payable(seller).call{value: sellerAmount}("");
        require(sellerSuccess, "Seller payment failed");

        // Refund excess payment
        if (msg.value > salePrice) {
            (bool refundSuccess, ) = payable(msg.sender).call{value: msg.value - salePrice}("");
            require(refundSuccess, "Refund failed");
        }

        totalSalesVolume += salePrice;

        emit IdeaSold(tokenId, seller, msg.sender, salePrice);
    }

    /**
     * @dev List an idea for sale
     * @param tokenId Token ID to list
     * @param price New price in MATIC (wei)
     */
    function listIdea(uint256 tokenId, uint256 price) external {
        require(_exists(tokenId), "Token does not exist");
        require(ownerOf(tokenId) == msg.sender, "Only owner can list");
        require(price > 0, "Price must be > 0");

        ideas[tokenId].isListed = true;
        ideas[tokenId].price = price;

        emit IdeaListed(tokenId, price);
    }

    /**
     * @dev Unlist an idea from sale
     * @param tokenId Token ID to unlist
     */
    function unlistIdea(uint256 tokenId) external {
        require(_exists(tokenId), "Token does not exist");
        require(ownerOf(tokenId) == msg.sender, "Only owner can unlist");

        ideas[tokenId].isListed = false;

        emit IdeaUnlisted(tokenId);
    }

    /**
     * @dev Update idea price
     * @param tokenId Token ID
     * @param newPrice New price in MATIC (wei)
     */
    function updatePrice(uint256 tokenId, uint256 newPrice) external {
        require(_exists(tokenId), "Token does not exist");
        require(ownerOf(tokenId) == msg.sender, "Only owner can update");
        require(newPrice > 0, "Price must be > 0");

        ideas[tokenId].price = newPrice;

        emit IdeaPriceUpdated(tokenId, newPrice);
    }

    /**
     * @dev Get idea details
     * @param tokenId Token ID
     * @return Idea struct
     */
    function getIdea(uint256 tokenId) external view returns (
        string memory title,
        string memory description,
        string memory category,
        string memory imageURI,
        string memory metadataURI,
        address creator,
        address currentOwner,
        uint256 price,
        uint256 createdAt,
        uint256 salesCount,
        bool isListed
    ) {
        require(_exists(tokenId), "Token does not exist");
        Idea memory idea = ideas[tokenId];
        
        return (
            idea.title,
            idea.description,
            idea.category,
            idea.imageURI,
            idea.metadataURI,
            idea.creator,
            idea.currentOwner,
            idea.price,
            idea.createdAt,
            idea.salesCount,
            idea.isListed
        );
    }

    /**
     * @dev Get all ideas by creator
     * @param creator Creator address
     * @return Array of token IDs
     */
    function getIdeasByCreator(address creator) external view returns (uint256[] memory) {
        return creatorIdeas[creator];
    }

    /**
     * @dev Get all ideas by category
     * @param category Category name
     * @return Array of token IDs
     */
    function getIdeasByCategory(string memory category) external view returns (uint256[] memory) {
        return categoryIdeas[category];
    }

    /**
     * @dev Get all listed ideas (for marketplace browsing)
     * @return Array of listed token IDs
     */
    function getListedIdeas() external view returns (uint256[] memory) {
        uint256 total = _tokenIds.current();
        uint256 listedCount = 0;

        // Count listed ideas
        for (uint256 i = 1; i <= total; i++) {
            if (ideas[i].isListed) {
                listedCount++;
            }
        }

        // Create array of listed token IDs
        uint256[] memory listed = new uint256[](listedCount);
        uint256 index = 0;

        for (uint256 i = 1; i <= total; i++) {
            if (ideas[i].isListed) {
                listed[index] = i;
                index++;
            }
        }

        return listed;
    }

    /**
     * @dev Get total number of ideas created
     * @return Total count
     */
    function getTotalIdeas() external view returns (uint256) {
        return _tokenIds.current();
    }

    /**
     * @dev Get marketplace statistics
     */
    function getMarketplaceStats() external view returns (
        uint256 totalIdeas,
        uint256 totalVolume,
        uint256 feePercentage
    ) {
        return (
            _tokenIds.current(),
            totalSalesVolume,
            marketplaceFee
        );
    }

    /**
     * @dev Update marketplace fee (only owner)
     * @param newFee New fee in basis points (e.g., 250 = 2.5%)
     */
    function updateMarketplaceFee(uint256 newFee) external onlyOwner {
        require(newFee <= 1000, "Fee too high (max 10%)");
        marketplaceFee = newFee;
        emit MarketplaceFeeUpdated(newFee);
    }

    /**
     * @dev Update fee recipient (only owner)
     * @param newRecipient New fee recipient address
     */
    function updateFeeRecipient(address newRecipient) external onlyOwner {
        require(newRecipient != address(0), "Invalid recipient");
        feeRecipient = newRecipient;
    }

    /**
     * @dev Check if token exists
     */
    function _exists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }

    /**
     * @dev Override _transfer to update ownership tracking
     */
    function _transfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override {
        super._transfer(from, to, tokenId);
        ideas[tokenId].currentOwner = to;
    }
}