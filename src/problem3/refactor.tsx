// Added import
import { React, useMemo } from 'react'

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

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props
  const balances = useWalletBalances()
  const prices = usePrices()

  // Should be put to utils or composable hook relate to this page
  // const getPriority = (blockchain: any): number => {
  //   switch (blockchain) {
  //     case 'Osmosis':
  //       return 100
  //     case 'Ethereum':
  //       return 50
  //     case 'Arbitrum':
  //       return 30
  //     case 'Zilliqa':
  //       return 20
  //     case 'Neo':
  //       return 20
  //     default:
  //       return -99
  //   }
  // }

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
        const leftPriority = getBlockChainPriority(lhs.blockchain)
        const rightPriority = getBlockChainPriority(rhs.blockchain)
        // Nothing special sort here. Just make simply
        return rightPriority - leftPriority
        // if (leftPriority > rightPriority) {
        //   return -1
        // } else if (rightPriority > leftPriority) {
        //   return 1
        // }
      }) as WalletBalance[] // added cast type here for using in other function
  }, [balances]) // removed redundant prices dependencies

  // could put formattedBalances into useWalletBalances hook
  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed(),
    } as FormattedWalletBalance
  })

  // It's seems function are using formattedBalances
  const rows = formattedBalances.map((balance, index: number) => {
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

  return <div {...rest}>{rows}</div>
}
