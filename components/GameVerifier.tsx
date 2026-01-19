'use client'

import React, { useState } from 'react'
import { verifyGame } from '@/utils/provablyFair'
import { RoundConfig } from '@/utils/provablyFair'
import toast from 'react-hot-toast'

interface GameVerifierProps {
  gameId?: string
  commitmentHash?: string
  seed?: string
  roundConfigs?: RoundConfig[]
}

export function GameVerifier({ gameId, commitmentHash: initialHash, seed: initialSeed, roundConfigs: initialConfigs }: GameVerifierProps) {
  const [commitmentHash, setCommitmentHash] = useState(initialHash || '')
  const [seed, setSeed] = useState(initialSeed || '')
  const [roundConfigs, setRoundConfigs] = useState<RoundConfig[]>(initialConfigs || [])
  const [verificationResult, setVerificationResult] = useState<{ valid: boolean; message: string } | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)

  const handleVerify = async () => {
    if (!commitmentHash || !seed || roundConfigs.length === 0) {
      toast.error('Please fill in all fields')
      return
    }

    setIsVerifying(true)
    try {
      const isValid = await verifyGame(commitmentHash, 'v1', roundConfigs, seed)
      
      if (isValid) {
        setVerificationResult({
          valid: true,
          message: '✅ Game is provably fair! The commitment hash matches the seed and round configuration.',
        })
        toast.success('Verification successful!')
      } else {
        setVerificationResult({
          valid: false,
          message: '❌ Verification failed! The commitment hash does not match the provided seed and round configuration.',
        })
        toast.error('Verification failed')
      }
    } catch (error) {
      setVerificationResult({
        valid: false,
        message: '❌ Error during verification. Please check your inputs.',
      })
      toast.error('Verification error')
      console.error(error)
    } finally {
      setIsVerifying(false)
    }
  }

  const addRound = () => {
    setRoundConfigs([...roundConfigs, { cups: 2 }])
  }

  const removeRound = (index: number) => {
    setRoundConfigs(roundConfigs.filter((_, i) => i !== index))
  }

  const updateRoundCups = (index: number, cups: number) => {
    const updated = [...roundConfigs]
    updated[index] = { cups }
    setRoundConfigs(updated)
  }

  return (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Game Verifier</h2>
      <p className="text-gray-600 mb-6">
        Verify that your game was provably fair by entering the commitment hash, seed, and round configuration.
      </p>

      <div className="space-y-4">
        {/* Commitment Hash */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Commitment Hash
          </label>
          <input
            type="text"
            value={commitmentHash}
            onChange={(e) => setCommitmentHash(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black font-mono text-sm"
            placeholder="0x..."
          />
        </div>

        {/* Seed */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Game Seed
          </label>
          <input
            type="text"
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black font-mono text-sm"
            placeholder="64-character hex string"
          />
        </div>

        {/* Round Configurations */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Round Configurations (Number of Cups per Round)
          </label>
          <div className="space-y-2">
            {roundConfigs.map((config, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span className="text-sm font-medium w-20">Round {index + 1}:</span>
                <input
                  type="number"
                  min="2"
                  max="7"
                  value={config.cups}
                  onChange={(e) => updateRoundCups(index, parseInt(e.target.value) || 2)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
                />
                <button
                  onClick={() => removeRound(index)}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={addRound}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-800"
            >
              + Add Round
            </button>
          </div>
        </div>

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          disabled={isVerifying}
          className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isVerifying ? 'Verifying...' : 'Verify Game'}
        </button>

        {/* Verification Result */}
        {verificationResult && (
          <div className={`p-4 rounded-lg ${
            verificationResult.valid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <div className={`font-semibold ${
              verificationResult.valid ? 'text-green-800' : 'text-red-800'
            }`}>
              {verificationResult.message}
            </div>
          </div>
        )}

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-sm text-blue-800">
            <strong>How it works:</strong>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>The commitment hash is generated before the game starts</li>
              <li>It contains an encrypted fingerprint of the seed and round configuration</li>
              <li>After the game, the seed is revealed</li>
              <li>You can verify that the hash matches the seed and configuration</li>
              <li>This proves the game was fair and couldn't be manipulated</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

