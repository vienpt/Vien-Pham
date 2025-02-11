// Added import
import { React, useMemo, useState } from 'react'

interface WalletBalance {
  currency: string
  amount: number
  blockchain: string // Added missing blockchain property
}

// Updated formatted by extends WalletBalance interface
interface FormattedWalletBalance extends WalletBalance {
  formatted: string
}

interface Props extends BoxProps {}

// Define enum blockchain
enum BlockchainPriority {
  Osmosis = 100,
  Ethereum = 50,
  Arbitrum = 30,
  Zilliqa = 20,
  Neo = 20,
  Default = -99,
}

function getBlockChainPriority(blockchain: string): number {
  const currentBlockChainPriority =
    blockchain as keyof typeof BlockchainPriority

  if (currentBlockChainPriority) {
    return BlockchainPriority[currentBlockChainPriority]
  }
  return BlockchainPriority.Default
}

export const WalletPage: React.FC<Props> = (props: Props) => {
  const { ...rest } = props
  const { formattedBalances } = useWalletBalances()
  const { prices } = usePrices()

  // It's seems function are using formattedBalances
  const rows = formattedBalances.map(
    (balance: FormattedWalletBalance, index: number) => {
      const usdValue = prices[balance.currency] * balance.amount
      return (
        <WalletRow
          className={classes.row}
          key={`${balance.currency}-${index}`} // determine key instead just index
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      )
    }
  )

  return <div {...rest}>{rows}</div>
}

// Assume this is hook  useWalletBalances()
export function useWalletBalances() {
  const [balances, setBalances] = useState<WalletBalance[]>([])

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getBlockChainPriority(balance.blockchain)
        // lhsPriority doesn't exists. Should be current balancePriority as assume
        // updated condition with avoid nested conditional
        if (
          balancePriority > BlockchainPriority.Default &&
          balance.amount <= 0
        ) {
          return true
        }
        return false
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getBlockChainPriority(lhs.blockchain) as number // as cast here to make sort valid with number
        const rightPriority = getBlockChainPriority(rhs.blockchain) as number // as cast here to make sort valid with number

        return rightPriority - leftPriority
      })
  }, [balances]) // removed redundant prices dependencies

  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed(),
    } as FormattedWalletBalance
  })

  return {
    formattedBalances,
  }
}

export function usePrices() {
  const [prices, setPrices] = useState<any>()

  return {
    prices,
  }
}
