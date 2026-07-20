//Newsletter API route
// Handles newsletter subscription requests

import { NextRequest, NextResponse } from "next/server"

// Buttondown newsletter integration
async function subscribeToButtondown(email: string, listId?: string) {
  const buttondownApiKey = process.env.NEWSLETTER_API_KEY
  const buttondownListId = process.env.NEWSLETTER_LIST_ID
  
  if (!buttondownApiKey) {
    throw new Error("NEWSLETTER_API_KEY is not configured")
  }

  const list = listId || buttondownListId

  const formData = new FormData()
  formData.append('email', email)
  if (list) {
    formData.append('list', list)
  }

  const response = await fetch('https://api.buttondown.com/v1/subscribers', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${buttondownApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      list: list
    })
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || `Failed to subscribe: ${response.status}`)
  }

  return response.json()
}

export async function POST(request: NextRequest) {
  try {
    const { email, name, listId } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email address is required' },
        { status: 400 }
      )
    }

    try {
      await subscribeToButtondown(email, listId)

      return NextResponse.json({
        success: true,
        message: 'Successfully subscribed to the newsletter!'
      })
    } catch (error) {
      console.error('Buttondown subscription error:', error)

      return NextResponse.json(
        { error: 'Failed to subscribe. Please try again later.' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Newsletter API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
