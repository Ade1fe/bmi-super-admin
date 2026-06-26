'use client'

import { AppShell } from '@/components/app-shell'
import React, { useState } from 'react'
import {
  AchievementTabs,
  BadgeSection,
  CreateBadgeModal,
  Badge,
  Tab,
} from './components'

const AchievementsPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('all')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Mock data - replace with API calls
  const badgesData = {
    course_milestones: [
      {
        id: '1',
        name: 'First Steps',
        status: 'Unlocked May 12',
        icon: '🏅',
        backgroundColor: 'bg-pink-100',
      },
      {
        id: '2',
        name: 'Module Master',
        status: 'Unlocked Jun 05',
        icon: '🎖️',
        backgroundColor: 'bg-yellow-50',
      },
      {
        id: '3',
        name: 'Course Legend',
        status: 'Finish all courses',
        icon: '👑',
        backgroundColor: 'bg-orange-100',
      },
      {
        id: '4',
        name: 'Final Project(Certified Pro)',
        status: 'Locked',
        icon: '⭐',
        backgroundColor: 'bg-slate-900',
      },
    ] as Badge[],
    learning_streaks: [
      {
        id: '5',
        name: '7 Day Fire',
        status: 'Unlocked Jun 05',
        icon: '🔥',
        backgroundColor: 'bg-slate-900',
      },
      {
        id: '6',
        name: '30 Day Grind',
        status: 'Unlocked Jun 05',
        icon: '⭐',
        backgroundColor: 'bg-slate-900',
      },
      {
        id: '7',
        name: 'Century Club',
        status: '100 day streak',
        icon: '🏆',
        backgroundColor: 'bg-red-900',
      },
    ] as Badge[],
    skill_mastery: [
      {
        id: '8',
        name: 'Quiz Titan',
        status: 'Top 5% score',
        icon: '🏆',
        backgroundColor: 'bg-slate-900',
      },
      {
        id: '9',
        name: 'Fast Learner',
        status: 'Unlocked Jun 05',
        icon: '🔥',
        backgroundColor: 'bg-slate-900',
      },
      {
        id: '10',
        name: 'Grand Master',
        status: 'Unlocked Jun 05',
        icon: '🏆',
        backgroundColor: 'bg-yellow-50',
      },
    ] as Badge[],
  }

  const tabs: Tab[] = [
    { id: 'all', label: 'All Badges', count: null },
    { id: 'course_milestones', label: 'Course Milestones', count: 4 },
    { id: 'learning_streaks', label: 'Learning Streaks', count: 3 },
    { id: 'skill_mastery', label: 'Skill Mastery', count: 3 },
  ]

  const handleCreateBadge = async (badgeData: {
    name: string
    category: string
    criteria: string
    image?: File
  }) => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const formData = new FormData()
      formData.append('name', badgeData.name)
      formData.append('category', badgeData.category)
      formData.append('criteria', badgeData.criteria)

      if (badgeData.image) {
        formData.append('image', badgeData.image)
      }

      const response = await fetch('/api/achievements/create', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          errorData.message || `Failed to create badge (${response.status})`
        )
      }

      const createdBadge = await response.json()
      console.log('Badge created successfully:', createdBadge)

      setSuccess('Badge created successfully!')
      setIsCreateModalOpen(false)

      // TODO: Refresh badges list or add new badge to state
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to create badge'
      setError(errorMessage)
      console.error('Error creating badge:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const getActiveTabData = () => {
    if (activeTab === 'all') {
      return [
        {
          title: 'Course Milestones',
          badges: badgesData.course_milestones,
          icon: '✨',
        },
        {
          title: 'Learning Streaks',
          badges: badgesData.learning_streaks,
          icon: '🔥',
        },
        { title: 'Skill Mastery', badges: badgesData.skill_mastery, icon: '🎓' },
      ]
    }

    const sectionMap: Record<
      string,
      { title: string; badges: Badge[]; icon: string }
    > = {
      course_milestones: {
        title: 'Course Milestones',
        badges: badgesData.course_milestones,
        icon: '✨',
      },
      learning_streaks: {
        title: 'Learning Streaks',
        badges: badgesData.learning_streaks,
        icon: '🔥',
      },
      skill_mastery: {
        title: 'Skill Mastery',
        badges: badgesData.skill_mastery,
        icon: '🎓',
      },
    }

    return [sectionMap[activeTab]]
  }

  return (
    <AppShell
      title="Achievement Gallery"
      activeSection="achievements"
      contentClassName="px-4 py-5 sm:px-6 lg:px-9 lg:py-8"
    >
      <div className="space-y-8">
        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <div className="text-red-600">
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <p className="text-red-800 font-medium">Error</p>
              <p className="text-red-700 text-[16px]">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-400 hover:text-red-600"
            >
              ✕
            </button>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <div className="text-green-600">
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="text-green-800 font-medium">{success}</p>
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Achievement Gallery
            </h1>
            <p className="mt-1 text-[16px] text-gray-600">
              Create and setup student badges
            </p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors"
          >
            <span>+</span>
            {isLoading ? 'Creating...' : 'Create Badge'}
          </button>
        </div>

        {/* Tabs */}
        <AchievementTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Badge Sections */}
        <div className="space-y-12">
          {getActiveTabData().map((section) => (
            <BadgeSection
              key={section.title}
              title={section.title}
              icon={section.icon}
              badges={section.badges}
            />
          ))}
        </div>
      </div>

      {/* Create Badge Modal */}
      <CreateBadgeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateBadge={handleCreateBadge}
      />
    </AppShell>
  )
}

export default AchievementsPage