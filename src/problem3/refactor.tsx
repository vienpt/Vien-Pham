// Added import
import { React, useMemo, useState, memo } from 'react'

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

  return (
    <div {...rest}>
      <WalletRowList formattedBalances={formattedBalances} prices={prices} />
    </div>
  )
}

interface WalletRowListProps {
  formattedBalances: FormattedWalletBalance[]
  prices: any
  classes: {
    row: string
  }
}
export const WalletRowList = memo(
  ({ formattedBalances, prices, classes }: WalletRowListProps) => {
    const rows = formattedBalances.map((balance, index) => {
      /**
       * Purpose of this implementation is unclear.
       * Here are some alternative solutions:
       * 1. Add usdValue to the interface and transform it in formatBalances
       * 2. Optimize usePrices hook implementation at page level and list binding
       * 3. Calculate values in WalletRow component using computed properties
       */
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
    })

    return <>{rows}</>
  }
)

// Assume this is hook useWalletBalances()
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

// Assume this is hook usePrices()
export function usePrices() {
  const [prices, setPrices] = useState<any>()

  return {
    prices,
  }
}
