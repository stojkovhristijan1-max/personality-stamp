export interface UserInfo {
  id?: string
  name: string
  dob: string
  nationality: string
  sex: 'male' | 'female' | 'non-binary'
  human_robot: 'human' | 'robot'
  personality_type?: string
  sigil_url?: string
  selfie_url?: string
  created_at?: string
  updated_at?: string
}

export interface PersonalityType {
  id: string
  name: string
  description: string
  traits: string[]
}

export interface QuizAnswer {
  questionId: number
  answer: number
}

export interface DigitalID {
  userId: string
  userInfo: UserInfo
  personalityType: PersonalityType
  sigil: string
  selfieUrl?: string
  generatedAt: string
}
