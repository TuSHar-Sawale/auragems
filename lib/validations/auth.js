export const validateLoginForm = (email, password) => {
  const errors = {}
  
  if (!email || !email.includes('@')) {
    errors.email = 'Valid email is required'
  }
  
  if (!password || password.length < 6) {
    errors.password = 'Password must be at least 6 characters'
  }
  
  return { isValid: Object.keys(errors).length === 0, errors }
}

export const validateSignupForm = (name, email, password, confirmPassword) => {
  const errors = {}
  
  if (!name || name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters'
  }
  
  if (!email || !email.includes('@')) {
    errors.email = 'Valid email is required'
  }
  
  if (!password || password.length < 6) {
    errors.password = 'Password must be at least 6 characters'
  }
  
  if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
  }
  
  return { isValid: Object.keys(errors).length === 0, errors }
}
