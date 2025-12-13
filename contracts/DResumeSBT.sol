// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DResumeSBT {
    struct Credential {
        address owner;
        string metadataHash;
        uint256 verificationScore;
        string[] skillTags;
        uint256 timestamp;
        address issuer;
        bool isActive;
    }

    struct Endorsement {
        address endorser;
        uint256 credentialId;
        string message;
        uint256 timestamp;
    }

    uint256 private _tokenIdCounter;
    address public owner;

    mapping(uint256 => Credential) public credentials;
    mapping(address => uint256[]) public userCredentials;
    mapping(uint256 => Endorsement[]) public credentialEndorsements;
    mapping(address => bool) public verifiedIssuers;

    event CredentialMinted(
        uint256 indexed tokenId,
        address indexed owner,
        string metadataHash,
        uint256 verificationScore,
        uint256 timestamp
    );

    event CredentialUpdated(
        uint256 indexed tokenId,
        string newMetadataHash,
        uint256 newScore,
        uint256 timestamp
    );

    event EndorsementAdded(
        uint256 indexed credentialId,
        address indexed endorser,
        string message,
        uint256 timestamp
    );

    event IssuerVerified(address indexed issuer, bool status);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not contract owner");
        _;
    }

    modifier onlyCredentialOwner(uint256 tokenId) {
        require(credentials[tokenId].owner == msg.sender, "Not credential owner");
        _;
    }

    constructor() {
        owner = msg.sender;
        verifiedIssuers[msg.sender] = true;
    }

    function mintCredential(
        string memory _metadataHash,
        uint256 _verificationScore,
        string[] memory _skillTags
    ) external returns (uint256) {
        _tokenIdCounter++;
        uint256 newTokenId = _tokenIdCounter;

        credentials[newTokenId] = Credential({
            owner: msg.sender,
            metadataHash: _metadataHash,
            verificationScore: _verificationScore,
            skillTags: _skillTags,
            timestamp: block.timestamp,
            issuer: msg.sender,
            isActive: true
        });

        userCredentials[msg.sender].push(newTokenId);

        emit CredentialMinted(
            newTokenId,
            msg.sender,
            _metadataHash,
            _verificationScore,
            block.timestamp
        );

        return newTokenId;
    }

    function mintCredentialForUser(
        address _user,
        string memory _metadataHash,
        uint256 _verificationScore,
        string[] memory _skillTags
    ) external returns (uint256) {
        require(verifiedIssuers[msg.sender], "Not a verified issuer");
        
        _tokenIdCounter++;
        uint256 newTokenId = _tokenIdCounter;

        credentials[newTokenId] = Credential({
            owner: _user,
            metadataHash: _metadataHash,
            verificationScore: _verificationScore,
            skillTags: _skillTags,
            timestamp: block.timestamp,
            issuer: msg.sender,
            isActive: true
        });

        userCredentials[_user].push(newTokenId);

        emit CredentialMinted(
            newTokenId,
            _user,
            _metadataHash,
            _verificationScore,
            block.timestamp
        );

        return newTokenId;
    }

    function updateCredential(
        uint256 _tokenId,
        string memory _newMetadataHash,
        uint256 _newScore,
        string[] memory _newSkillTags
    ) external onlyCredentialOwner(_tokenId) {
        Credential storage cred = credentials[_tokenId];
        cred.metadataHash = _newMetadataHash;
        cred.verificationScore = _newScore;
        cred.skillTags = _newSkillTags;
        cred.timestamp = block.timestamp;

        emit CredentialUpdated(_tokenId, _newMetadataHash, _newScore, block.timestamp);
    }

    function addEndorsement(
        uint256 _credentialId,
        string memory _message
    ) external {
        require(credentials[_credentialId].isActive, "Credential not active");
        require(credentials[_credentialId].owner != msg.sender, "Cannot endorse own credential");

        Endorsement memory newEndorsement = Endorsement({
            endorser: msg.sender,
            credentialId: _credentialId,
            message: _message,
            timestamp: block.timestamp
        });

        credentialEndorsements[_credentialId].push(newEndorsement);

        emit EndorsementAdded(_credentialId, msg.sender, _message, block.timestamp);
    }

    function revokeCredential(uint256 _tokenId) external onlyCredentialOwner(_tokenId) {
        credentials[_tokenId].isActive = false;
    }

    function setVerifiedIssuer(address _issuer, bool _status) external onlyOwner {
        verifiedIssuers[_issuer] = _status;
        emit IssuerVerified(_issuer, _status);
    }

    function getCredential(uint256 _tokenId) external view returns (
        address credOwner,
        string memory metadataHash,
        uint256 verificationScore,
        string[] memory skillTags,
        uint256 timestamp,
        address issuer,
        bool isActive
    ) {
        Credential storage cred = credentials[_tokenId];
        return (
            cred.owner,
            cred.metadataHash,
            cred.verificationScore,
            cred.skillTags,
            cred.timestamp,
            cred.issuer,
            cred.isActive
        );
    }

    function getUserCredentials(address _user) external view returns (uint256[] memory) {
        return userCredentials[_user];
    }

    function getEndorsements(uint256 _credentialId) external view returns (Endorsement[] memory) {
        return credentialEndorsements[_credentialId];
    }

    function getTotalCredentials() external view returns (uint256) {
        return _tokenIdCounter;
    }

    function verifyCredential(uint256 _tokenId) external view returns (
        bool exists,
        bool isActive,
        address credOwner,
        uint256 score,
        uint256 timestamp
    ) {
        Credential storage cred = credentials[_tokenId];
        exists = cred.owner != address(0);
        return (exists, cred.isActive, cred.owner, cred.verificationScore, cred.timestamp);
    }
}
