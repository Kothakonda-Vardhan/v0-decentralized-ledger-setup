"use client"

import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { contractABI } from "@/lib/contract-abi"

// Status enum mapping to match the smart contract
const statusMap = {
  0: "Pending",
  1: "InTransit",
  2: "Delivered",
  3: "Cancelled",
}

const statusOptions = [
  { value: "0", label: "Pending" },
  { value: "1", label: "In Transit" },
  { value: "2", label: "Delivered" },
  { value: "3", label: "Cancelled" },
]

export default function Home() {
  // Contract details
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3" // Your deployed contract address on Polygon Amoy

  // Form state
  const [formData, setFormData] = useState({
    id: "",
    product: "",
    quantity: "",
    source: "",
    sourceLocation: "",
    destination: "",
    destinationLocation: "",
    status: "0",
    date: "",
  })

  // App state
  const [transactions, setTransactions] = useState([])
  const [filteredTransactions, setFilteredTransactions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null)
  const [contract, setContract] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("0") // Updated default value to be a non-empty string
  const [error, setError] = useState("")

  // Connect to wallet and contract
  const connectWallet = async () => {
    try {
      setIsLoading(true)

      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum, undefined, {
          ensAddress: null, // Disable ENS lookups
          ensNetwork: null, // Disable ENS network
        })
        await provider.send("eth_requestAccounts", [])
        const signer = await provider.getSigner()
        const contract = new ethers.Contract(contractAddress, contractABI, signer)

        setProvider(provider)
        setSigner(signer)
        setContract(contract)
        setIsConnected(true)

        // Load transactions after connecting
        await loadTransactions(contract)
      } else {
        setError("Please install MetaMask to use this application")
      }
    } catch (error) {
      console.error("Error connecting wallet:", error)
      setError("Failed to connect wallet. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Load transactions from the blockchain
  const loadTransactions = async (contractInstance) => {
    try {
      setIsLoading(true)
      console.log("Loading transactions...")

      // Check if contract instance is valid
      if (!contractInstance) {
        console.error("Contract instance is null or undefined")
        setError("Contract instance is not available")
        return
      }

      // Log contract address
      console.log("Contract address:", await contractInstance.getAddress())

      // Try to get transaction count
      console.log("Getting transaction count...")
      const count = await contractInstance.getTransactionCount()
      console.log("Transaction count:", count.toString())

      const txs = []

      for (let i = 0; i < count; i++) {
        console.log(`Fetching transaction ${i}...`)
        try {
          const tx = await contractInstance.getTransaction(i)
          console.log(`Transaction ${i} data:`, tx)

          txs.push({
            id: tx.id,
            product: tx.product,
            quantity: tx.quantity,
            source: tx.source,
            sourceLocation: tx.sourceLocation,
            destination: tx.destination,
            destinationLocation: tx.destinationLocation,
            status: tx.status.toString(),
            date: new Date(Number(tx.date) * 1000).toISOString().split("T")[0],
            transactionId: tx.transactionId,
          })
        } catch (txError) {
          console.error(`Error fetching transaction ${i}:`, txError)
        }
      }

      console.log("All transactions loaded:", txs)
      setTransactions(txs)
      setFilteredTransactions(txs)
    } catch (error) {
      console.error("Error loading transactions:", error)
      setError(`Failed to load transactions: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Handle status selection
  const handleStatusChange = (value) => {
    setFormData({
      ...formData,
      status: value,
    })
  }

  // Add a new transaction
  const addTransaction = async (e) => {
    e.preventDefault()

    if (!isConnected) {
      setError("Please connect your wallet first")
      return
    }

    try {
      setIsLoading(true)
      setError("")

      // Convert date to UNIX timestamp
      const timestamp = Math.floor(new Date(formData.date).getTime() / 1000)

      // Generate transaction ID hash using keccak256
      const transactionIdString = `${formData.id}-${formData.product}-${Date.now()}`
      const transactionIdBytes = ethers.keccak256(ethers.toUtf8Bytes(transactionIdString))

      // Call the smart contract function
      const tx = await contract.addTransaction(
        formData.id,
        formData.product,
        formData.quantity,
        formData.source,
        formData.sourceLocation,
        formData.destination,
        formData.destinationLocation,
        Number.parseInt(formData.status),
        timestamp,
        transactionIdBytes,
      )

      await tx.wait()

      // Reset form and reload transactions
      setFormData({
        id: "",
        product: "",
        quantity: "",
        source: "",
        sourceLocation: "",
        destination: "",
        destinationLocation: "",
        status: "0",
        date: "",
      })

      await loadTransactions(contract)
    } catch (error) {
      console.error("Error adding transaction:", error)
      setError("Failed to add transaction. Please check your inputs and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Add this function to test transaction addition with hardcoded data
  // Add this after the addTransaction function
  const addTestTransaction = async () => {
    if (!isConnected) {
      setError("Please connect your wallet first")
      return
    }

    try {
      setIsLoading(true)
      setError("")

      // Hardcoded test data
      const testData = {
        id: "TEST-001",
        product: "Rice",
        quantity: "100 tons",
        source: "Test Farm",
        sourceLocation: "Test Location",
        destination: "Test Destination",
        destinationLocation: "Test City",
        status: 0, // Pending
        date: Math.floor(Date.now() / 1000), // Current timestamp
      }

      // Generate transaction ID hash
      const transactionIdString = `${testData.id}-${testData.product}-${Date.now()}`
      const transactionIdBytes = ethers.keccak256(ethers.toUtf8Bytes(transactionIdString))

      console.log("Adding test transaction...")
      console.log("Transaction data:", testData)
      console.log("Transaction ID bytes:", transactionIdBytes)

      // Call the smart contract function
      const tx = await contract.addTransaction(
        testData.id,
        testData.product,
        testData.quantity,
        testData.source,
        testData.sourceLocation,
        testData.destination,
        testData.destinationLocation,
        testData.status,
        testData.date,
        transactionIdBytes,
      )

      console.log("Transaction sent:", tx.hash)
      await tx.wait()
      console.log("Transaction confirmed!")

      // Reload transactions
      await loadTransactions(contract)
    } catch (error) {
      console.error("Error adding test transaction:", error)
      setError(`Failed to add test transaction: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  // Filter transactions based on search term and status
  useEffect(() => {
    if (transactions.length > 0) {
      let filtered = [...transactions]

      if (searchTerm) {
        filtered = filtered.filter(
          (tx) =>
            tx.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tx.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tx.destination.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      }

      if (statusFilter) {
        filtered = filtered.filter((tx) => tx.status === statusFilter)
      }

      setFilteredTransactions(filtered)
    }
  }, [searchTerm, statusFilter, transactions])

  // Initialize read-only provider for public data
  const initReadOnlyProvider = async () => {
    try {
      // Use the Polygon Amoy RPC URL for read-only access with ENS disabled
      const readOnlyProvider = new ethers.JsonRpcProvider("https://rpc-amoy.polygon.technology/", undefined, {
        ensAddress: null, // Disable ENS lookups
        ensNetwork: null, // Disable ENS network
      })
      const readOnlyContract = new ethers.Contract(contractAddress, contractABI, readOnlyProvider)

      setProvider(readOnlyProvider)
      setContract(readOnlyContract)

      // Load transactions in read-only mode
      await loadTransactions(readOnlyContract)
    } catch (error) {
      console.error("Error initializing read-only provider:", error)
    }
  }

  useEffect(() => {
    const init = async () => {
      try {
        // Use the Polygon Amoy RPC URL for read-only access
        const readOnlyProvider = new ethers.JsonRpcProvider("https://rpc-amoy.polygon.technology/")
        const readOnlyContract = new ethers.Contract(contractAddress, contractABI, readOnlyProvider)

        setProvider(readOnlyProvider)
        setContract(readOnlyContract)

        // Load transactions in read-only mode
        await loadTransactions(readOnlyContract)
      } catch (error) {
        console.error("Error initializing read-only provider:", error)
      }
    }

    initReadOnlyProvider()
  }, [])

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Food Logistics Blockchain Ledger</h1>
        <p className="text-gray-600 mb-4">Track food logistics transactions on the Polygon Amoy Testnet</p>

        {!isConnected && (
          <Button onClick={connectWallet} disabled={isLoading} className="bg-purple-600 hover:bg-purple-700">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              "Connect Wallet to Add Transactions"
            )}
          </Button>
        )}

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">{error}</div>}
      </div>

      <Tabs defaultValue="view" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="view">View Transactions</TabsTrigger>
          <TabsTrigger value="add" disabled={!isConnected}>
            Add Transaction
          </TabsTrigger>
        </TabsList>

        <TabsContent value="view">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Ledger</CardTitle>
              <CardDescription>View all food logistics transactions recorded on the blockchain</CardDescription>

              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search by product, ID, source or destination"
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="w-full sm:w-48">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">All Statuses</SelectItem>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                </div>
              ) : filteredTransactions.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableCaption>
                      Showing {filteredTransactions.length} of {transactions.length} transactions
                    </TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead>Destination</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.map((tx, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{tx.id}</TableCell>
                          <TableCell>{tx.product}</TableCell>
                          <TableCell>{tx.quantity}</TableCell>
                          <TableCell>{`${tx.source} (${tx.sourceLocation})`}</TableCell>
                          <TableCell>{`${tx.destination} (${tx.destinationLocation})`}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                tx.status === "0"
                                  ? "bg-yellow-500"
                                  : tx.status === "1"
                                    ? "bg-blue-500"
                                    : tx.status === "2"
                                      ? "bg-green-500"
                                      : "bg-red-500"
                              }
                            >
                              {statusMap[tx.status]}
                            </Badge>
                          </TableCell>
                          <TableCell>{tx.date}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No transactions found.{" "}
                  {transactions.length > 0 ? "Try adjusting your filters." : "Add a transaction to get started."}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>Add New Transaction</CardTitle>
              <CardDescription>Record a new food logistics transaction on the blockchain</CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={addTransaction} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="id">Transaction ID</Label>
                    <Input
                      id="id"
                      name="id"
                      placeholder="e.g., SCE-002"
                      value={formData.id}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="product">Product</Label>
                    <Input
                      id="product"
                      name="product"
                      placeholder="e.g., Rice"
                      value={formData.product}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      name="quantity"
                      placeholder="e.g., 1000 tons"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="source">Source</Label>
                    <Input
                      id="source"
                      name="source"
                      placeholder="e.g., Haryana Farms"
                      value={formData.source}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sourceLocation">Source Location</Label>
                    <Input
                      id="sourceLocation"
                      name="sourceLocation"
                      placeholder="e.g., Haryana"
                      value={formData.sourceLocation}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="destination">Destination</Label>
                    <Input
                      id="destination"
                      name="destination"
                      placeholder="e.g., UP Ration Center"
                      value={formData.destination}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="destinationLocation">Destination Location</Label>
                    <Input
                      id="destinationLocation"
                      name="destinationLocation"
                      placeholder="e.g., Uttar Pradesh"
                      value={formData.destinationLocation}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={handleStatusChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Add Transaction to Blockchain"
                  )}
                </Button>
                <Button
                  type="button"
                  onClick={addTestTransaction}
                  className="w-full mt-4 bg-gray-600 hover:bg-gray-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Add Test Transaction"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}
