'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'

interface Question {
  id: number
  question_text: string
  question_type: string
  options: string[]
  required: boolean
  order_num: number
}

interface Survey {
  id: number
  title: string
  description: string
  questions: Question[]
}

export default function SurveyPage() {
  const [survey, setSurvey] = useState<Survey | null>(null)
  const [answers, setAnswers] = useState<{ [key: number]: any }>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    fetchLatestSurvey()
  }, [])

  const fetchLatestSurvey = async () => {
    try {
      // 這裡可以連接到你的 API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/surveys/1/questions`)
      const data = await response.json()
      
      setSurvey({
        id: 1,
        title: data.survey?.title || '問卷調查',
        description: data.survey?.description || '請回答以下問題',
        questions: data.questions || []
      })
    } catch (error) {
      console.error('載入問卷失敗:', error)
      // 使用模擬數據
      setSurvey({
        id: 1,
        title: '客戶滿意度調查',
        description: '感謝您抽空填寫此問卷,您的意見對我們非常重要',
        questions: [
          {
            id: 1,
            question_text: '您對我們的服務整體滿意度如何?',
            question_type: 'rating',
            options: ['1', '2', '3', '4', '5'],
            required: true,
            order_num: 1
          },
          {
            id: 2,
            question_text: '您最喜歡我們服務的哪個方面?',
            question_type: 'single_choice',
            options: ['產品品質', '客戶服務', '價格合理', '配送速度'],
            required: false,
            order_num: 2
          }
        ]
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnswer = (questionId: number, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }))
  }

  const handleSubmit = async () => {
    if (!survey) return

    setIsSubmitting(true)
    try {
      // 這裡可以提交到你的 API
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsComplete(true)
    } catch (error) {
      console.error('提交問卷失敗:', error)
      alert('提交失敗,請稍後再試')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">載入問卷中...</p>
        </div>
      </div>
    )
  }

  if (isComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">提交成功!</h2>
          <p className="text-gray-600 mb-6">感謝您的寶貴意見</p>
          <Link href="/" className="inline-block bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors">
            返回首頁
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-5 h-5 mr-2" />
            返回
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{survey?.title}</h1>
          <p className="text-gray-600">{survey?.description}</p>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {survey?.questions.map((question) => (
            <div key={question.id} className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {question.question_text}
                {question.required && <span className="text-red-500 ml-1">*</span>}
              </h3>

              {question.question_type === 'rating' && (
                <div className="flex gap-3">
                  {question.options.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleAnswer(question.id, option)}
                      className={`flex-1 py-3 rounded-lg border-2 transition-colors ${
                        answers[question.id] === option
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}

              {question.question_type === 'single_choice' && (
                <div className="space-y-2">
                  {question.options.map((option) => (
                    <label
                      key={option}
                      className="flex items-center p-4 rounded-lg border-2 cursor-pointer transition-colors hover:bg-gray-50"
                    >
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={option}
                        checked={answers[question.id] === option}
                        onChange={(e) => handleAnswer(question.id, e.target.value)}
                        className="w-4 h-4 text-primary-500"
                      />
                      <span className="ml-3 text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {question.question_type === 'text' && (
                <textarea
                  value={answers[question.id] || ''}
                  onChange={(e) => handleAnswer(question.id, e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                  rows={4}
                  placeholder="請輸入您的回答..."
                />
              )}
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="mt-8">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-primary-500 text-white py-4 rounded-xl font-semibold hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? '提交中...' : '提交問卷'}
          </button>
        </div>
      </div>
    </div>
  )
}
