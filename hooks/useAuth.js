import { useAuth } from '@/context/AuthContext'

export const useIsAdmin = () => {
  const { user } = useAuth()
  return user?.user_metadata?.is_admin === true
}

export default useIsAdmin
