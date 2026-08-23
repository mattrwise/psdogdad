import { DIRECTORY_IS_PUBLIC } from '@/lib/pros'
import type { SectionTab } from '@/components/SectionTabs'

/**
 * The tab rows for the two sections that span more than one page.
 *
 * Defined once, here, because every page in a section has to draw the same row
 * — a tab set that differs depending on which tab you are standing on is worse
 * than no tabs at all. Kept out of lib/site.ts so this reads the pro directory's
 * own switch without that file having an opinion about it.
 */

/**
 * Local: places you drive to, and people who come to you. Two different
 * questions, one directory.
 *
 * The Dog Pros tab is absent until there are listings behind it, the same rule
 * DIRECTORY_IS_PUBLIC applies everywhere else. With it hidden this list is a
 * single tab, and SectionTabs draws nothing at all — which is right, because
 * until the directory opens there genuinely is only one page here.
 */
export const localTabs: SectionTab[] = [
  { href: '/local', label: 'Places & Businesses', icon: '📋' },
  ...(DIRECTORY_IS_PUBLIC ? [{ href: '/pros', label: 'Dog Pros', icon: '🦮' }] : []),
]

/** Community: the conversation, and the people having it. */
export const communityTabs: SectionTab[] = [
  { href: '/forums', label: 'Discussions', icon: '💬' },
  { href: '/members', label: 'Member Directory', icon: '👤' },
]
