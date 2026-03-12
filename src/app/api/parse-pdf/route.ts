import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const pdfFile = formData.get('pdf') as File

    if (!pdfFile) {
      return NextResponse.json({ error: 'No PDF file provided' }, { status: 400 })
    }

    const arrayBuffer = await pdfFile.arrayBuffer()
    const pdfParse = require('pdf-parse') // eslint-disable-line
    const data = await pdfParse(Buffer.from(arrayBuffer))

    return NextResponse.json({ text: data.text })
  } catch (error) {
    console.error('PDF parse error:', error)
    return NextResponse.json({ error: 'Failed to parse PDF' }, { status: 500 })
  }
}
