import { fetchAPODs } from '../services/apod'
import React from 'react'
import { ApoList } from '../components/ApoList'

export default async function Home() {
  const apos = await fetchAPODs()
  return <ApoList apos={apos} />
}
