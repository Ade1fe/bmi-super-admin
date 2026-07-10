'use client'

import { AppShell } from '@/components/app-shell'
import React, { useEffect, useState } from 'react'
import { apiRequest, endpoints } from '@/lib/endpoints'
import { useAuthSession } from '@/lib/auth-session'
import {
  AchievementTabs,
  BadgeSection,
  CreateBadgeModal,
  EditBadgeModal,
  Badge,
  Tab,
} from './components'

const AchievementsPage = () => {
  const { session, isHydrated } = useAuthSession()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null)
  const [isFetchingBadge, setIsFetchingBadge] = useState(false)
  const [activeTab, setActiveTab] = useState('all')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [badgeSections, setBadgeSections] = useState<{
    course_milestones: Badge[]
    learning_streaks: Badge[]
    skill_mastery: Badge[]
  }>({
    course_milestones: [],
    learning_streaks: [],
    skill_mastery: [],
  })

  const badgesData = badgeSections

  const tabs: Tab[] = [
    { id: 'all', label: 'All Badges', count: null },
    { id: 'course_milestones', label: 'Course Milestones', count: badgeSections.course_milestones.length },
    { id: 'learning_streaks', label: 'Learning Streaks', count: badgeSections.learning_streaks.length },
    { id: 'skill_mastery', label: 'Skill Mastery', count: badgeSections.skill_mastery.length },
  ]

  const handleCreateBadge = async (badgeData: {
    name: string
    category: string
    criteria: string
    description: string
    points: number
    imageUrl?: string
  }) => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    if (!isHydrated || !session?.token) {
      setError('Authentication required to create badges.')
      setIsLoading(false)
      return
    }

    try {
      await apiRequest<void>(endpoints.achievements.badges.create, {
        method: 'POST',
        authToken: session.token,
        body: badgeData,
      })

      setSuccess('Badge created successfully!')
      setIsCreateModalOpen(false)
      await fetchBadges()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create badge')
      console.error('Error creating badge:', err)
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * GET /achievements/badges/:badgeId
   * Fetch full badge details before opening the manage/edit modal.
   */
  const handleSelectBadge = async (badge: Badge) => {
    if (!isHydrated || !session?.token) {
      setError('Authentication required.')
      return
    }

    setError(null)
    setIsFetchingBadge(true)

    try {
      const response = await apiRequest<unknown>(
        endpoints.achievements.badges.byId(badge.id),
        { method: 'GET', authToken: session.token }
      )

      const record = (response ?? {}) as Record<string, unknown>
      const data = (record.data ?? record) as Record<string, unknown>

      const imageUrl =
        typeof data.imageUrl === 'string'
          ? data.imageUrl
          : typeof data.image_url === 'string'
          ? data.image_url
          : badge.imageUrl

      setSelectedBadge({
        id: String(data.id ?? badge.id),
        name: String(data.name ?? badge.name),
        status: typeof data.status === 'string' ? data.status : badge.status,
        icon: badge.icon,
        backgroundColor: badge.backgroundColor,
        imageUrl,
        description: typeof data.description === 'string' ? data.description : '',
        points: Number(data.points ?? 0),
        category: typeof data.category === 'string' ? data.category : '',
        criteria: typeof data.criteria === 'string' ? data.criteria : '',
      })
      setIsEditModalOpen(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load badge details')
      console.error('Error fetching badge:', err)
    } finally {
      setIsFetchingBadge(false)
    }
  }

  /**
   * PUT /achievements/badges/:badgeId
   */
  const handleUpdateBadge = async (
    badgeId: string,
    updates: {
      name: string
      category: string
      criteria: string
      description: string
      points: number
      imageUrl?: string
    }
  ) => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    if (!isHydrated || !session?.token) {
      setError('Authentication required to update badges.')
      setIsLoading(false)
      return
    }

    try {
      await apiRequest<void>(endpoints.achievements.badges.update(badgeId), {
        method: 'PUT',
        authToken: session.token,
        body: updates,
      })

      setSuccess('Badge updated successfully!')
      setIsEditModalOpen(false)
      setSelectedBadge(null)
      await fetchBadges()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update badge')
      console.error('Error updating badge:', err)
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * DELETE /achievements/badges/:badgeId
   */
  const handleDeleteBadge = async (badgeId: string) => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    if (!isHydrated || !session?.token) {
      setError('Authentication required to delete badges.')
      setIsLoading(false)
      return
    }

    try {
      await apiRequest<void>(endpoints.achievements.badges.delete(badgeId), {
        method: 'DELETE',
        authToken: session.token,
      })

      setSuccess('Badge deleted successfully!')
      setIsEditModalOpen(false)
      setSelectedBadge(null)
      await fetchBadges()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete badge')
      console.error('Error deleting badge:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchBadges = async () => {
    if (!isHydrated || !session?.token) {
      return
    }

    try {
      const response = await apiRequest<unknown>(endpoints.achievements.badges.all(), {
        method: 'GET',
        authToken: session.token,
      })

      const normalizedBadges = (() => {
        if (!response) return []
        if (Array.isArray(response)) return response

        const result = response as Record<string, unknown>
        if (Array.isArray(result.badges)) return result.badges
        if (Array.isArray(result.items)) return result.items
        if (Array.isArray(result.data)) return result.data
        if (
          result.data &&
          typeof result.data === 'object' &&
          Array.isArray((result.data as Record<string, unknown>).badges)
        ) {
          return (result.data as Record<string, unknown>).badges
        }
        return []
      })() as Array<Record<string, unknown>>

      const allBadges = normalizedBadges.map((badge) => {
        const imageUrl =
          typeof badge.imageUrl === 'string'
            ? badge.imageUrl
            : typeof badge.image_url === 'string'
            ? badge.image_url
            : undefined

        return {
          id: String(badge.id ?? ''),
          name: String(badge.name ?? ''),
          category: String(badge.category ?? ''),
          criteria: String(badge.criteria ?? ''),
          description: String(badge.description ?? ''),
          imageUrl,
          points: Number(badge.points ?? 0),
          status:
            typeof badge.status === 'string' && badge.status.trim()
              ? badge.status
              : 'NEW',
        }
      })

      const groupedBadges = {
        course_milestones: allBadges
          .filter((badge) => badge.category === 'Course Milestone')
          .map((badge) => ({
            id: badge.id,
            name: badge.name,
            status: badge.status,
            icon: '🏅',
            backgroundColor: badge.imageUrl ? 'bg-slate-900' : 'bg-pink-100',
            imageUrl: badge.imageUrl,
            description: badge.description,
            points: badge.points,
            category: badge.category,
            criteria: badge.criteria,
          })),
          // -
        learning_streaks: allBadges
          .filter((badge) => badge.category === 'Learning Streaks')
          .map((badge) => ({
            id: badge.id,
            name: badge.name,
            status: badge.status,
            icon: '🔥',
            backgroundColor: badge.imageUrl ? 'bg-slate-900' : 'bg-orange-100',
            imageUrl: badge.imageUrl,
            description: badge.description,
            points: badge.points,
            category: badge.category,
            criteria: badge.criteria,
          })),
        skill_mastery: allBadges
          .filter((badge) => badge.category === 'Skill Mastery')
          .map((badge) => ({
            id: badge.id,
            name: badge.name,
            status: badge.status,
            icon: '🎓',
            backgroundColor: badge.imageUrl ? 'bg-slate-900' : 'bg-yellow-50',
            imageUrl: badge.imageUrl,
            description: badge.description,
            points: badge.points,
            category: badge.category,
            criteria: badge.criteria,
          })),
      }

      setBadgeSections(groupedBadges)
    } catch (error) {
      console.error('[achievements] failed to fetch badges', error)
      setError('Unable to load badges. Check console for details.')
    }
  }

  const getActiveTabData = () => {
    if (activeTab === 'all') {
      return [
        { title: 'Course Milestones', badges: badgesData.course_milestones, icon: '✨' },
        { title: 'Learning Streaks', badges: badgesData.learning_streaks, icon: '🔥' },
        { title: 'Skill Mastery', badges: badgesData.skill_mastery, icon: '🎓' },
      ]
    }

    const sectionMap: Record<string, { title: string; badges: Badge[]; icon: string }> = {
      course_milestones: { title: 'Course Milestones', badges: badgesData.course_milestones, icon: '✨' },
      learning_streaks: { title: 'Learning Streaks', badges: badgesData.learning_streaks, icon: '🔥' },
      skill_mastery: { title: 'Skill Mastery', badges: badgesData.skill_mastery, icon: '🎓' },
    }

    return [sectionMap[activeTab]]
  }

  useEffect(() => {
    fetchBadges()
  }, [isHydrated, session?.token])

  return (
    <AppShell
      title="Achievement Gallery"
      activeSection="achievements"
      contentClassName="px-4 py-5 sm:px-6 lg:px-9 lg:py-8"
    >
      <div className="space-y-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <p className="text-red-700 text-[16px]">{error}</p>
            <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600">✕</button>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <p className="text-green-800 font-medium">{success}</p>
          </div>
        )}

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Achievement Gallery</h1>
            <p className="mt-1 text-[16px] text-gray-600">Create and setup student badges</p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors"
          >
            <span>+</span>
            {isLoading ? 'Working...' : 'Create Badge'}
          </button>
        </div>

        <AchievementTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="space-y-12">
          {getActiveTabData().map((section) => (
            <BadgeSection
              key={section.title}
              title={section.title}
              icon={section.icon}
              badges={section.badges}
              onSelectBadge={handleSelectBadge}
            />
          ))}
        </div>
      </div>

      <CreateBadgeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateBadge={handleCreateBadge}
      />

      <EditBadgeModal
        isOpen={isEditModalOpen}
        badge={selectedBadge}
        isLoading={isLoading || isFetchingBadge}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedBadge(null)
        }}
        onUpdateBadge={handleUpdateBadge}
        onDeleteBadge={handleDeleteBadge}
      />
    </AppShell>
  )
}

export default AchievementsPage