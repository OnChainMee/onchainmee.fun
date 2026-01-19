'use client'

import React, { useState } from 'react'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import toast from 'react-hot-toast'

export function WalletBalance() {
  const { publicKey } = useWallet()
  const { connection } = useConnection()
  const [showDeposit, setShowDeposit] = useState(false)
  const [showWithdraw, setShowWithdraw] = useState(false)
  const [depositAmount, setDepositAmount] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [withdrawAddress, setWithdrawAddress] = useState('')
  const [broFunBalance, setBroFunBalance] = useState(0) // In-game balance

  // Mock deposit function (in production, this would interact with smart contract)
  const handleDeposit = async () => {
    if (!publicKey) return

    const amount = parseFloat(depositAmount)
    if (isNaN(amount) || amount <= 0) {
      toast.error('Invalid deposit amount')
      return
    }

    try {
      // In production: Send SOL to smart contract deposit function
      // For now, just simulate
      toast.success(`Deposited ${amount} SOL to Bro Fun wallet`)
      setBroFunBalance((prev) => prev + amount)
      setDepositAmount('')
      setShowDeposit(false)
    } catch (error) {
      toast.error('Deposit failed')
      console.error(error)
    }
  }

  // Mock withdraw function (in production, this would interact with smart contract)
  const handleWithdraw = async () => {
    if (!publicKey) return

    const amount = parseFloat(withdrawAmount)
    if (isNaN(amount) || amount <= 0) {
      toast.error('Invalid withdrawal amount')
      return
    }

    if (amount > broFunBalance) {
      toast.error('Insufficient balance')
      return
    }

    const address = withdrawAddress || publicKey.toString()
    if (!address || address.length < 32) {
      toast.error('Invalid Solana address')
      return
    }

    try {
      // In production: Call smart contract withdraw function
      // For now, just simulate
      toast.success(`Withdrew ${amount} SOL to ${address.slice(0, 8)}...`)
      setBroFunBalance((prev) => prev - amount)
      setWithdrawAmount('')
      setWithdrawAddress('')
      setShowWithdraw(false)
    } catch (error) {
      toast.error('Withdrawal failed')
      console.error(error)
    }
  }

  if (!publicKey) return null

  return (
    <div className="space-y-4">
      {/* Balance Display */}
      <div className="bg-white rounded-lg p-4">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm text-gray-600">Bro Fun Balance</div>
            <div className="text-2xl font-bold">{broFunBalance.toFixed(4)} SOL</div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setShowDeposit(true)
                setShowWithdraw(false)
              }}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 text-sm"
            >
              Deposit
            </button>
            <button
              onClick={() => {
                setShowWithdraw(true)
                setShowDeposit(false)
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
            >
              Withdraw
            </button>
          </div>
        </div>
      </div>

      {/* Deposit Modal */}
      {showDeposit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Deposit SOL</h3>
              <button
                onClick={() => setShowDeposit(false)}
                className="text-gray-500 hover:text-black"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (SOL)
                </label>
                <input
                  type="number"
                  min="0.001"
                  step="0.001"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
                  placeholder="0.0"
                />
              </div>
              <div className="text-sm text-gray-600">
                Deposit SOL from your wallet to play without confirming every transaction.
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={handleDeposit}
                  className="flex-1 py-3 bg-black text-white rounded-lg hover:bg-gray-800 font-semibold"
                >
                  Deposit
                </button>
                <button
                  onClick={() => setShowDeposit(false)}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdraw && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Withdraw SOL</h3>
              <button
                onClick={() => setShowWithdraw(false)}
                className="text-gray-500 hover:text-black"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (SOL)
                </label>
                <input
                  type="number"
                  min="0.001"
                  step="0.001"
                  max={broFunBalance}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
                  placeholder="0.0"
                />
                <button
                  onClick={() => setWithdrawAmount(broFunBalance.toString())}
                  className="mt-2 text-sm text-gray-600 hover:text-black"
                >
                  Max: {broFunBalance.toFixed(4)} SOL
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Withdraw To (Solana Address)
                </label>
                <input
                  type="text"
                  value={withdrawAddress}
                  onChange={(e) => setWithdrawAddress(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black font-mono text-sm"
                  placeholder={publicKey.toString()}
                />
                <div className="mt-1 text-xs text-gray-500">
                  Leave empty to withdraw to connected wallet
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={handleWithdraw}
                  className="flex-1 py-3 bg-black text-white rounded-lg hover:bg-gray-800 font-semibold"
                >
                  Withdraw
                </button>
                <button
                  onClick={() => setShowWithdraw(false)}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

