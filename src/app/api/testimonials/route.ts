import { NextResponse } from 'next/server'
import { db } from '@/lib/firestore'

export async function GET() {
  try {
    // Firestoreから体験談データを取得
    const testimonialsSnapshot = await db.collection('testimonials').get()
    const testimonials = testimonialsSnapshot.docs.map(doc => doc.data())
    
    return NextResponse.json(testimonials)
  } catch (error) {
    console.error('Testimonials API error:', error)
    
    // フォールバック用のダミーデータ
    const fallbackTestimonials = [
      {
        id: 'test_1',
        doctor_name: 'Dr. 田中',
        specialty: '救急科',
        experience_years: 8,
        hospital_id: 'h1',
        program_id: 'prog_1',
        rating: 5,
        content: '宇都宮での2週間は本当に充実していました。地域医療の実践的なスキルが身につき、温泉も楽しめました。',
        photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=1200&auto=format&fit=crop',
        created_at: Date.now() - 86400000 * 30
      },
      {
        id: 'test_2',
        doctor_name: 'Dr. 佐藤',
        specialty: '内科',
        experience_years: 12,
        hospital_id: 'h3',
        program_id: 'prog_2',
        rating: 5,
        content: '札幌での1ヶ月は雪国医療の貴重な経験でした。チーム医療の重要性を実感できました。',
        photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=1200&auto=format&fit=crop',
        created_at: Date.now() - 86400000 * 45
      },
      {
        id: 'test_3',
        doctor_name: 'Dr. 山田',
        specialty: '循環器科',
        experience_years: 10,
        hospital_id: 'h4',
        program_id: 'prog_4',
        rating: 4,
        content: '福岡での救急プログラムは国際的な視点も学べて、とても勉強になりました。',
        photo: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=1200&auto=format&fit=crop',
        created_at: Date.now() - 86400000 * 60
      },
      {
        id: 'test_4',
        doctor_name: 'Dr. 鈴木',
        specialty: '小児科',
        experience_years: 7,
        hospital_id: 'h5',
        program_id: 'prog_5',
        rating: 5,
        content: '沖縄での小児科プログラムは、温暖な気候での医療を体験できて素晴らしかったです。',
        photo: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?q=80&w=1200&auto=format&fit=crop',
        created_at: Date.now() - 86400000 * 20
      },
      {
        id: 'test_5',
        doctor_name: 'Dr. 高橋',
        specialty: '研究科',
        experience_years: 15,
        hospital_id: 'h6',
        program_id: 'prog_3',
        rating: 5,
        content: '京都大学での長期研修は、研究と臨床の両方を学べる貴重な機会でした。',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop',
        created_at: Date.now() - 86400000 * 10
      },
      {
        id: 'test_6',
        doctor_name: 'Dr. 伊藤',
        specialty: '内科',
        experience_years: 9,
        hospital_id: 'h2',
        program_id: 'prog_2',
        rating: 4,
        content: '前橋でのプログラムは、地域密着型の医療を学ぶ良い機会でした。',
        photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1200&auto=format&fit=crop',
        created_at: Date.now() - 86400000 * 15
      }
    ]
    
    return NextResponse.json(fallbackTestimonials)
  }
}