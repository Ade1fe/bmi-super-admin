'use client'

import React, { useState } from 'react'

// ============= TYPES =============
export interface Badge {
  id: string
  name: string
  status: string
  icon: string
  backgroundColor: string
  imageUrl?: string
  description?: string
  points?: number
  category?: string
  criteria?: string
}

export interface Tab {
  id: string
  label: string
  count: number | null
}

export interface AchievementTabsProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void
}

export interface BadgeCardProps {
  badge: Badge
  onSelect?: (badge: Badge) => void
}

export interface BadgeSectionProps {
  title: string
  icon: string
  badges: Badge[]
  onSelectBadge?: (badge: Badge) => void
}

export interface CreateBadgeModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateBadge: (badgeData: {
    name: string
    category: string
    criteria: string
    description: string
    points: number
    imageUrl?: string
  }) => void
}

export interface EditBadgeModalProps {
  isOpen: boolean
  badge: Badge | null
  isLoading?: boolean
  onClose: () => void
  onUpdateBadge: (
    badgeId: string,
    updates: {
      name: string
      category: string
      criteria: string
      description: string
      points: number
      imageUrl?: string
    }
  ) => void
  onDeleteBadge: (badgeId: string) => void
}

// ============= ACHIEVEMENT TABS =============
export const AchievementTabs: React.FC<AchievementTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="border-b border-gray-200">
      <div className="flex gap-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === tab.id
                ? 'border-green-600 text-gray-900'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
            {tab.count !== null && (
              <span className="ml-2 text-xs text-gray-500">({tab.count})</span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

// ============= BADGE CARD =============
export const BadgeCard: React.FC<BadgeCardProps> = ({ badge, onSelect }) => {
  const [hasImageError, setHasImageError] = useState(false)
  const displayStatus = badge.status || 'NEW'
  const isLocked = displayStatus === 'Locked'
  const isNew = displayStatus.includes('NEW')
  const showImage = Boolean(badge.imageUrl && !hasImageError)

  return (
    <div
      className={`rounded-lg overflow-hidden transition-transform hover:scale-105 cursor-pointer group border border-gray-200 shadow-sm ${
        isLocked ? 'opacity-70' : 'hover:border-green-500'
      }`}
      onClick={() => onSelect?.(badge)}
    >
      <div
        className={`${badge.backgroundColor} aspect-square flex items-center justify-center relative overflow-hidden`}
      >
        {isNew && (
          <div className="absolute top-2 right-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
            NEW
          </div>
        )}

        {showImage ? (
          <img
            src={badge.imageUrl}
            alt={badge.name}
            className="h-full w-full object-cover"
            onError={() => setHasImageError(true)}
          />
        ) : (
          <div className="text-6xl md:text-7xl">{badge.icon}</div>
        )}

        {isLocked && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="text-3xl">🔒</div>
          </div>
        )}
      </div>

      <div className="bg-white p-3">
        <h3 className="font-semibold text-sm text-gray-900 text-center">
          {badge.name}
        </h3>
        <p
          className={`text-xs text-center mt-1 ${
            isLocked ? 'text-gray-600' : 'text-blue-600'
          }`}
        >
          {displayStatus}
        </p>
        <div className="mt-3 flex flex-wrap gap-2 justify-center">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              onSelect?.(badge)
            }}
            className="rounded-md border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-100"
          >
            Manage
          </button>
        </div>
      </div>
    </div>
  )
}

// ============= BADGE SECTION =============
export const BadgeSection: React.FC<BadgeSectionProps> = ({
  title,
  icon,
  badges,
  onSelectBadge, // ← this was missing from destructuring, which caused the error
}) => {
  const unlockedCount = badges.filter(
    (b) => b.status !== 'Locked' && !b.status.startsWith('Finish')
  ).length

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-xl">{icon}</span>
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        {unlockedCount > 0 && (
          <span className="ml-auto text-sm text-gray-500">
            {unlockedCount} Unlocked
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {badges.map((badge) => (
          <BadgeCard key={badge.id} badge={badge} onSelect={onSelectBadge} />
        ))}
      </div>
    </div>
  )
}

// ============= CREATE BADGE MODAL =============
const BADGE_CATEGORIES = [
  'Course Milestone',
  'Learning Streaks',
  'Skill Mastery',
]

const BADGE_CRITERIA_OPTIONS = [
  { value: 'finish_lesson', label: 'Finish a lesson' },
  { value: 'finish_first_3_modules', label: 'Finish first 3 modules' },
  { value: 'finish_course', label: 'Finish an entire course' },
  { value: 'finish_final_project', label: 'Finish the final project' },
  { value: 'streak_7_days', label: 'Maintain a 7-day streak' },
  { value: 'streak_30_days', label: 'Maintain a 30-day streak' },
  { value: 'streak_100_days', label: 'Maintain a 100-day streak' },
  { value: 'top_5_quiz', label: 'Top 5 quiz score' },
  { value: 'top_5_quickest_course', label: 'Top 5 quickest course completion' },
  { value: 'finish_10_courses', label: 'Finish 10 courses' },
]

export const CreateBadgeModal: React.FC<CreateBadgeModalProps> = ({
  isOpen,
  onClose,
  onCreateBadge,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Course Milestone',
    criteria: '',
    description: '',
    points: 100,
    imageUrl: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const badgeData = {
      name: formData.name,
      category: formData.category,
      criteria: formData.criteria,
      description: formData.description,
      points: formData.points,
      imageUrl: formData.imageUrl || undefined,
    }

    Promise.resolve(onCreateBadge(badgeData))
      .then(() => {
        setFormData({
          name: '',
          category: 'Course Milestone',
          criteria: '',
          description: '',
          points: 100,
          imageUrl: '',
        })
      })
      .finally(() => setIsSubmitting(false))
  }

  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Create Achievement Badge
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Badge Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="First steps"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Badge Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-colors bg-white"
                >
                  {BADGE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Badge Criteria</label>
              <select
                name="criteria"
                value={formData.criteria}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-colors bg-white"
              >
                <option value="">Select a criteria</option>
                {BADGE_CRITERIA_OPTIONS.map((criteria) => (
                  <option key={criteria.value} value={criteria.value}>{criteria.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Badge Description</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Master the fundamentals of Relational Databases and SQL."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Badge Points</label>
              <input
                type="number"
                name="points"
                min={0}
                value={formData.points}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Badge Image URL</label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                placeholder="https://lms-assets.com/badges/sql-master.png"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-colors"
              />
            </div>
          </form>

          <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 sticky bottom-0">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed font-medium transition-colors"
            >
              Discard
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors flex items-center gap-2"
            >
              {isSubmitting ? 'Creating...' : (<>Create <span>→</span></>)}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

// ============= EDIT / MANAGE BADGE MODAL (Update + Delete) =============
export const EditBadgeModal: React.FC<EditBadgeModalProps> = ({
  isOpen,
  badge,
  isLoading,
  onClose,
  onUpdateBadge,
  onDeleteBadge,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Course Milestone',
    criteria: '',
    description: '',
    points: 0,
    imageUrl: '',
  })
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  // Sync form when a new badge is loaded into the modal
  React.useEffect(() => {
    if (badge) {
      setFormData({
        name: badge.name ?? '',
        category: badge.category ?? 'Course Milestone',
        criteria: badge.criteria ?? '',
        description: badge.description ?? '',
        points: badge.points ?? 0,
        imageUrl: badge.imageUrl ?? '',
      })
      setConfirmingDelete(false)
    }
  }, [badge])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'points' ? Number(value) : value,
    }))
  }

  if (!isOpen || !badge) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdateBadge(badge.id, {
      name: formData.name,
      category: formData.category,
      criteria: formData.criteria,
      description: formData.description,
      points: formData.points,
      imageUrl: formData.imageUrl || undefined,
    })
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40 transition-opacity" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Manage Badge</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Badge Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Badge Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-colors bg-white"
                >
                  {BADGE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Badge Criteria</label>
              <select
                name="criteria"
                value={formData.criteria}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-colors bg-white"
              >
                <option value="">Select a criteria</option>
                {BADGE_CRITERIA_OPTIONS.map((criteria) => (
                  <option key={criteria.value} value={criteria.value}>{criteria.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Badge Description</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Badge Points</label>
                <input
                  type="number"
                  name="points"
                  min={0}
                  value={formData.points}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Badge Image URL</label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-colors"
                />
              </div>
            </div>
          </form>

          <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 flex items-center justify-between gap-3 sticky bottom-0">
            {/* Delete side */}
            <div className="flex items-center gap-2">
              {confirmingDelete ? (
                <>
                  <span className="text-sm text-red-700">Delete this badge?</span>
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => onDeleteBadge(badge.id)}
                    className="px-3 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:bg-gray-400 text-sm font-medium"
                  >
                    Yes, delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmingDelete(false)}
                    className="px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => setConfirmingDelete(true)}
                  className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 disabled:opacity-50 font-medium transition-colors"
                >
                  Delete Badge
                </button>
              )}
            </div>

            {/* Save side */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-400 font-medium transition-colors"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}