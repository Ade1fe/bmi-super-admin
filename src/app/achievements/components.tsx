'use client'

import React, { useState } from 'react'

// ============= TYPES =============
export interface Badge {
  id: string
  name: string
  status: string
  icon: string
  backgroundColor: string
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
}

export interface BadgeSectionProps {
  title: string
  icon: string
  badges: Badge[]
}

export interface CreateBadgeModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateBadge: (badgeData: {
    name: string
    category: string
    criteria: string
    image?: File
  }) => void
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
export const BadgeCard: React.FC<BadgeCardProps> = ({ badge }) => {
  const isLocked = badge.status === 'Locked'

  return (
    <div
      className={`rounded-lg overflow-hidden transition-transform hover:scale-105 cursor-pointer group ${
        isLocked ? 'opacity-60' : ''
      }`}
    >
      {/* Badge Background Container */}
      <div
        className={`${badge.backgroundColor} aspect-square flex items-center justify-center relative overflow-hidden`}
      >
        {/* NEW Badge */}
        {badge.status.includes('NEW') && (
          <div className="absolute top-2 right-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
            NEW
          </div>
        )}

        {/* Badge Icon */}
        <div className="text-6xl md:text-7xl">{badge.icon}</div>

        {/* Locked Overlay */}
        {isLocked && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="text-3xl">🔒</div>
          </div>
        )}
      </div>

      {/* Badge Info */}
      <div className="bg-white p-3">
        <h3 className="font-semibold text-sm text-gray-900 text-center">
          {badge.name}
        </h3>
        <p
          className={`text-xs text-center mt-1 ${
            isLocked ? 'text-gray-600' : 'text-blue-600'
          }`}
        >
          {badge.status}
        </p>
      </div>
    </div>
  )
}

// ============= BADGE SECTION =============
export const BadgeSection: React.FC<BadgeSectionProps> = ({
  title,
  icon,
  badges,
}) => {
  const unlockedCount = badges.filter(
    (b) => b.status !== 'Locked' && !b.status.startsWith('Finish')
  ).length

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center gap-2">
        <span className="text-xl">{icon}</span>
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        {unlockedCount > 0 && (
          <span className="ml-auto text-sm text-gray-500">
            {unlockedCount} Unlocked
          </span>
        )}
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {badges.map((badge) => (
          <BadgeCard
            key={badge.id}
            badge={badge}
          />
        ))}
      </div>
    </div>
  )
}

// ============= CREATE BADGE MODAL =============
const BADGE_CATEGORIES = [
  'Course Milestone',
  'Learning Streak',
  'Skill Mastery',
  'Engagement',
  'Performance',
]

const BADGE_CRITERIA = [
  'When a learner finishes the lesson in a register course',
  'When a learner finishes the first 3 module in a subject',
  'When a learner finishes an entire course',
  'When a learner complete their final project',
  'When a learner learns consistently for 7 days',
  'When a learner complete a 30 days learning streak',
  'When a learner complete a 100 days learning streak',
  'When a learner is among the top 5 highest scorer in quiz',
  'Top 5 learner to finish a course in the quickest time',
  'Register and finish 10 course on the platform',
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
    image: null as File | null,
  })
  const [isDragging, setIsDragging] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        image: files[0],
      }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFormData((prev) => ({
        ...prev,
        image: e.target.files![0],
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    setIsSubmitting(true)
    
    // Build the badge data, excluding null image
    const badgeData = {
      name: formData.name,
      category: formData.category,
      criteria: formData.criteria,
      ...(formData.image && { image: formData.image }),
    }
    
    Promise.resolve(onCreateBadge(badgeData))
      .then(() => {
        setFormData({
          name: '',
          category: 'Course Milestone',
          criteria: '',
          image: null,
        })
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Create Achievement Badge
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Modal Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Form Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Badge Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Badge Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="First steps"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-colors"
                />
              </div>

              {/* Badge Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Badge Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-colors bg-white"
                >
                  {BADGE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Badge Criteria */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Badge Criteria
              </label>
              <select
                name="criteria"
                value={formData.criteria}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-colors bg-white"
              >
                <option value="">Select a criteria</option>
                {BADGE_CRITERIA.map((criteria, idx) => (
                  <option key={idx} value={criteria}>
                    {criteria}
                  </option>
                ))}
              </select>

              {/* Criteria Description */}
              {formData.criteria && (
                <p className="mt-2 text-sm text-gray-600">
                  {formData.criteria}
                </p>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Badge Image
              </label>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                  isDragging
                    ? 'border-green-600 bg-green-50'
                    : formData.image
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-300 bg-gray-50'
                }`}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="badge-image"
                />
                <label htmlFor="badge-image" className="cursor-pointer">
                  <div className="flex flex-col items-center gap-2">
                    <svg
                      className="w-8 h-8 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900">
                        {formData.image
                          ? formData.image.name
                          : 'Drag and drop or click to upload'}
                      </p>
                      {!formData.image && (
                        <p className="text-xs text-gray-600 mt-1">
                          (Max 5MB)
                        </p>
                      )}
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </form>

          {/* Modal Footer */}
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
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Creating...
                </>
              ) : (
                <>
                  Create
                  <span>→</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}