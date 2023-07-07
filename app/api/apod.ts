// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiResponse } from 'next'
import { fetchAPOD } from '../../services/apod'

export default function handler({ res }: { res: NextApiResponse }) {
  // fetch APOD data from NASA API
  fetchAPOD().then((data) => {
    res.status(200).json(data)
  })
}
