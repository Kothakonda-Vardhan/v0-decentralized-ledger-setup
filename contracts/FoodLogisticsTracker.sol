// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract FoodLogisticsTracker {
    // Status enum for tracking the state of a transaction
    enum Status { Pending, InTransit, Delivered, Cancelled }
    
    // Transaction struct to store all the required fields
    struct Transaction {
        string id;                  // Human-readable ID (e.g., SCE-002)
        string product;             // Product name (e.g., Rice)
        string quantity;            // Quantity with unit (e.g., 1000 tons)
        string source;              // Source name (e.g., Haryana Farms)
        string sourceLocation;      // Source location (e.g., Haryana)
        string destination;         // Destination name (e.g., UP Ration Center)
        string destinationLocation; // Destination location (e.g., Uttar Pradesh)
        Status status;              // Current status of the transaction
        uint256 date;               // UNIX timestamp of the transaction
        bytes32 transactionId;      // Unique identifier for the transaction
    }
    
    // Array to store all transactions
    Transaction[] public transactions;
    
    // Mapping to check for duplicate transaction IDs
    mapping(bytes32 => bool) private transactionExists;
    
    // Event emitted when a new transaction is added
    event TransactionAdded(
        string indexed id,
        string indexed product,
        Status status,
        bytes32 indexed transactionId
    );
    
    // Constructor
    constructor() {
        // Initialization if needed
    }
    
    // Function to add a new transaction
    function addTransaction(
        string memory _id,
        string memory _product,
        string memory _quantity,
        string memory _source,
        string memory _sourceLocation,
        string memory _destination,
        string memory _destinationLocation,
        Status _status,
        uint256 _date,
        bytes32 _transactionId
    ) public {
        // Check if transaction ID already exists
        require(!transactionExists[_transactionId], "Transaction ID already exists");
        
        // Create a new transaction
        Transaction memory newTransaction = Transaction({
            id: _id,
            product: _product,
            quantity: _quantity,
            source: _source,
            sourceLocation: _sourceLocation,
            destination: _destination,
            destinationLocation: _destinationLocation,
            status: _status,
            date: _date,
            transactionId: _transactionId
        });
        
        // Add transaction to the array
        transactions.push(newTransaction);
        
        // Mark transaction ID as used
        transactionExists[_transactionId] = true;
        
        // Emit event
        emit TransactionAdded(_id, _product, _status, _transactionId);
    }
    
    // Function to get a transaction by index
    function getTransaction(uint256 _index) public view returns (Transaction memory) {
        require(_index < transactions.length, "Transaction index out of bounds");
        return transactions[_index];
    }
    
    // Function to get a transaction by its unique ID
    function getTransactionById(bytes32 _transactionId) public view returns (Transaction memory) {
        for (uint256 i = 0; i < transactions.length; i++) {
            if (transactions[i].transactionId == _transactionId) {
                return transactions[i];
            }
        }
        
        // If transaction is not found, revert
        revert("Transaction not found");
    }
    
    // Function to get the total number of transactions
    function getTransactionCount() public view returns (uint256) {
        return transactions.length;
    }
}
