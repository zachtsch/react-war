import type { ComponentPropsWithoutRef } from 'react'

/** A standard playing card identified by rank and suit. */
export type Card = {
  /** The card's rank, with `T` for ten and `A` for ace. */
  rank: '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'T' | 'J' | 'Q' | 'K' | 'A'
  /** Clubs (`C`), diamonds (`D`), hearts (`H`), or spades (`S`). */
  suit: 'C' | 'D' | 'H' | 'S'
}

const rankNames: Record<Card['rank'], string> = {
  '2': 'Two',
  '3': 'Three',
  '4': 'Four',
  '5': 'Five',
  '6': 'Six',
  '7': 'Seven',
  '8': 'Eight',
  '9': 'Nine',
  T: 'Ten',
  J: 'Jack',
  Q: 'Queen',
  K: 'King',
  A: 'Ace',
}

const suitNames: Record<Card['suit'], string> = {
  C: 'Clubs',
  D: 'Diamonds',
  H: 'Hearts',
  S: 'Spades',
}

/** Props for a card image, including standard image sizing and styling options. */
export type CardImageProps = Omit<ComponentPropsWithoutRef<'img'>, 'src' | 'alt'> & {
  /** The card to display. Use `T` for ten and `C`, `D`, `H`, or `S` for its suit. */
  card: Card
}

/**
 * Displays any of the 52 playing cards using an SVG from block52/cards.
 * Automatically sets descriptive alt text, such as "Ace of Spades".
 *
 * @param props - The card and optional image attributes such as `width` or `className`.
 * @returns An image element with the card's SVG URL and full name as alt text.
 * @example
 * <CardImage card={{ rank: 'A', suit: 'S' }} width={120} />
 *
 * @see https://github.com/block52/cards
 */
export function CardImage({ card, ...props }: CardImageProps) {
  return (
    <img
      {...props}
      src={`https://raw.githubusercontent.com/block52/cards/main/${card.rank}${card.suit}.svg`}
      alt={`${rankNames[card.rank]} of ${suitNames[card.suit]}`}
    />
  )
}
