document.addEventListener('alpine:init', () => {
  Alpine.data('swapForm', () => ({
    TOKENS_BASE_URL:
      'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/',
    PRICES_API_URL: 'https://interview.switcheo.com/prices.json',

    // State data
    state: {
      prices: [],
      currencies: [],
      input: {
        amount: '',
        currency: '',
      },
      output: {
        amount: '',
        currency: '',
      },
      loading: false,
      error: null,
    },

    // Lifecycle Methods
    init() {
      this.fetchPrices()
    },

    // API Methods
    async fetchPrices() {
      try {
        const response = await fetch(this.PRICES_API_URL)
        const prices = await response.json()

        this.state.prices = prices
        this.state.currencies = [
          ...new Set(prices.map((price) => price.currency)),
        ]

        // Set default currencies
        if (!this.state.input.currency && this.state.currencies.length > 0) {
          this.state.input.currency = this.state.currencies[0]
          this.state.output.currency = this.state.currencies[1]
        }
      } catch (error) {
        this.state.error = 'Failed to fetch prices'
        console.error('Error fetching prices:', error)
      }
    },

    // UI Helpers
    getTokenIcon(currency) {
      if (!currency) return ''
      return `${this.TOKENS_BASE_URL}${currency}.svg`
    },

    formatNumber(num) {
      if (!num) return ''
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 6,
      }).format(num)
    },

    // Price Calculations
    getPrice(currency) {
      const priceData = this.state.prices.find((p) => p.currency === currency)
      return priceData ? parseFloat(priceData.price) : 0
    },

    getExchangeRate(fromCurrency, toCurrency) {
      const fromPrice = this.getPrice(fromCurrency)
      const toPrice = this.getPrice(toCurrency)

      return fromPrice && toPrice ? toPrice / fromPrice : 0
    },

    calculateOutput(input) {
      const rate = this.getExchangeRate(
        this.state.input.currency,
        this.state.output.currency
      )
      return input * rate
    },

    calculateInput(output) {
      const rate = this.getExchangeRate(
        this.state.output.currency,
        this.state.input.currency
      )
      return output * rate
    },

    validateForm(value) {
      const numValue = parseFloat(value)

      if (!/^\d*\.?\d*$/.test(value)) {
        this.state.error = 'Please enter numbers only'
        return
      }

      this.state.error = ''
      return numValue
    },

    // Event Handlers
    handleInputAmount(event) {
      let value = this.validateForm(event.target.value)
      this.state.input.amount = value ? value : ''

      const outputValue = this.calculateOutput(value)
      this.state.output.amount = outputValue
        ? this.formatNumber(outputValue)
        : ''
    },

    handleOutputAmount(event) {
      let value = this.validateForm(event.target.value)
      this.state.output.amount = value ? value : ''

      const inputValue = this.calculateInput(value)
      this.state.input.amount = inputValue ? this.formatNumber(inputValue) : ''
    },

    handleCurrencyChange() {
      if (this.state.input.amount) {
        const numValue = parseFloat(this.state.input.amount)
        const outputValue = this.calculateOutput(numValue)
        this.state.output.amount = this.formatNumber(outputValue)
      }
    },

    // handle Swap transaction
    async handleSwap() {
      if (!this.isValid) return

      try {
        this.state.loading = true

        // Simulate transaction
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Reset form
        this.state.input.amount = ''
        this.state.output.amount = ''

        this.showNotification('Swap successful!')
      } catch (error) {
        console.error('Swap failed:', error)
        this.showNotification('Swap failed. Please try again.')
      } finally {
        this.state.loading = false
      }
    },

    // Notifications
    showNotification(message) {
      setTimeout(() => alert(message), 0)
    },

    // Computed Properties
    get isValid() {
      return (
        parseFloat(this.state.input.amount) > 0 &&
        parseFloat(this.state.output.amount) > 0
      )
    },

    get formattedRate() {
      const rate = this.getExchangeRate(
        this.state.input.currency,
        this.state.output.currency
      )
      return `1 ${this.state.input.currency} = ${this.formatNumber(rate)} ${this.state.output.currency}`
    },
  }))
})
