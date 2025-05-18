export const contractABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "string",
        name: "id",
        type: "string",
      },
      {
        indexed: true,
        internalType: "string",
        name: "product",
        type: "string",
      },
      {
        indexed: false,
        internalType: "enum FoodLogisticsTracker.Status",
        name: "status",
        type: "uint8",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "transactionId",
        type: "bytes32",
      },
    ],
    name: "TransactionAdded",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_id",
        type: "string",
      },
      {
        internalType: "string",
        name: "_product",
        type: "string",
      },
      {
        internalType: "string",
        name: "_quantity",
        type: "string",
      },
      {
        internalType: "string",
        name: "_source",
        type: "string",
      },
      {
        internalType: "string",
        name: "_sourceLocation",
        type: "string",
      },
      {
        internalType: "string",
        name: "_destination",
        type: "string",
      },
      {
        internalType: "string",
        name: "_destinationLocation",
        type: "string",
      },
      {
        internalType: "enum FoodLogisticsTracker.Status",
        name: "_status",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "_date",
        type: "uint256",
      },
      {
        internalType: "bytes32",
        name: "_transactionId",
        type: "bytes32",
      },
    ],
    name: "addTransaction",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_index",
        type: "uint256",
      },
    ],
    name: "getTransaction",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "id",
            type: "string",
          },
          {
            internalType: "string",
            name: "product",
            type: "string",
          },
          {
            internalType: "string",
            name: "quantity",
            type: "string",
          },
          {
            internalType: "string",
            name: "source",
            type: "string",
          },
          {
            internalType: "string",
            name: "sourceLocation",
            type: "string",
          },
          {
            internalType: "string",
            name: "destination",
            type: "string",
          },
          {
            internalType: "string",
            name: "destinationLocation",
            type: "string",
          },
          {
            internalType: "enum FoodLogisticsTracker.Status",
            name: "status",
            type: "uint8",
          },
          {
            internalType: "uint256",
            name: "date",
            type: "uint256",
          },
          {
            internalType: "bytes32",
            name: "transactionId",
            type: "bytes32",
          },
        ],
        internalType: "struct FoodLogisticsTracker.Transaction",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTransactionCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_transactionId",
        type: "bytes32",
      },
    ],
    name: "getTransactionById",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "id",
            type: "string",
          },
          {
            internalType: "string",
            name: "product",
            type: "string",
          },
          {
            internalType: "string",
            name: "quantity",
            type: "string",
          },
          {
            internalType: "string",
            name: "source",
            type: "string",
          },
          {
            internalType: "string",
            name: "sourceLocation",
            type: "string",
          },
          {
            internalType: "string",
            name: "destination",
            type: "string",
          },
          {
            internalType: "string",
            name: "destinationLocation",
            type: "string",
          },
          {
            internalType: "enum FoodLogisticsTracker.Status",
            name: "status",
            type: "uint8",
          },
          {
            internalType: "uint256",
            name: "date",
            type: "uint256",
          },
          {
            internalType: "bytes32",
            name: "transactionId",
            type: "bytes32",
          },
        ],
        internalType: "struct FoodLogisticsTracker.Transaction",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "transactions",
    outputs: [
      {
        internalType: "string",
        name: "id",
        type: "string",
      },
      {
        internalType: "string",
        name: "product",
        type: "string",
      },
      {
        internalType: "string",
        name: "quantity",
        type: "string",
      },
      {
        internalType: "string",
        name: "source",
        type: "string",
      },
      {
        internalType: "string",
        name: "sourceLocation",
        type: "string",
      },
      {
        internalType: "string",
        name: "destination",
        type: "string",
      },
      {
        internalType: "string",
        name: "destinationLocation",
        type: "string",
      },
      {
        internalType: "enum FoodLogisticsTracker.Status",
        name: "status",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "date",
        type: "uint256",
      },
      {
        internalType: "bytes32",
        name: "transactionId",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
]
