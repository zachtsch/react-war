/**
 * Picks a random integer between two inclusive bounds.
 *
 * @param min - Smallest allowed integer, inclusive.
 * @param max - Largest allowed integer, inclusive.
 * @returns A random integer from `min` through `max`.
 * @throws {RangeError} If either bound is not a safe integer or `min > max`.
 * @example
 * randomInt(1, 10) // An integer from 1 through 10
 */
export function randomInt(min: number, max: number): number {
  if (!Number.isSafeInteger(min) || !Number.isSafeInteger(max) || min > max) {
    throw new RangeError('Expected safe integer bounds with min <= max')
  }

  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Picks one item from an array without modifying it.
 *
 * @param items - A non-empty array of items to choose from.
 * @returns An item from the array, preserving its type.
 * @throws {RangeError} If `items` is empty.
 * @example
 * randomChoice(['hearts', 'spades']) // 'hearts' or 'spades'
 */
export function randomChoice<T>(items: T[]): T {
  if (items.length === 0) {
    throw new RangeError('Cannot choose from an empty array')
  }

  return items[randomInt(0, items.length - 1)]
}

/**
 * Randomizes the order of items in a shallow copy of an array.
 * The original array stays unchanged; objects inside it are not cloned.
 *
 * @param items - The array to shuffle. May be empty.
 * @returns A new array containing the same items in random order.
 * @example
 * shuffle([1, 2, 3]) // For example, [3, 1, 2]
 */
export function shuffle<T>(items: T[]): T[] {
  const result = [...items]

  for (let i = result.length - 1; i > 0; i--) {
    const j = randomInt(0, i)
    ;[result[i], result[j]] = [result[j], result[i]]
  }

  return result
}

/**
 * Flips a virtual coin with an equal chance of either outcome.
 *
 * @returns `true` for heads or `false` for tails.
 * @example
 * const result = coinFlip() ? 'Heads' : 'Tails'
 */
export function coinFlip(): boolean {
  return Math.random() < 0.5
}

/**
 * Rolls a die with the specified number of sides.
 *
 * @param sides - Number of sides, as a positive safe integer. Defaults to `6`.
 * @returns A random integer from `1` through `sides`, inclusive.
 * @throws {RangeError} If `sides` is not a positive safe integer.
 * @example
 * rollDice() // An integer from 1 through 6
 * rollDice(20) // An integer from 1 through 20
 */
export function rollDice(sides: number = 6): number {
  return randomInt(1, sides)
}

/**
 * Generates a random RGB color ready to use in CSS.
 *
 * @returns A `#` followed by six lowercase hexadecimal digits.
 * @example
 * randomColor() // For example, '#a3b4c5'
 */
export function randomColor(): string {
  return `#${randomInt(0, 0xffffff).toString(16).padStart(6, '0')}`
}

/**
 * Generates a version 4 UUID using the Web Crypto API.
 * Requires a runtime with `crypto.randomUUID` (HTTPS or localhost in browsers).
 *
 * @returns A random UUID string in the standard 36-character format.
 * @example
 * randomId() // For example, '550e8400-e29b-41d4-a716-446655440000'
 */
export function randomId(): string {
  return crypto.randomUUID()
}
