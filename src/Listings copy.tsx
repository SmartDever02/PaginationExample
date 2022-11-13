import { ChangeEvent, useEffect, useState } from "react"

// components
import ImageBlock from "./components/ImageBlock"
import TextInput from "./components/TextInput"
import Pagination from "./components/Pagination"
import InfoBlock from "./components/InfoBlock"

// helper
import filterData from "./helper/filter"

import mockData from "./mock-data.json"

import "./Listings.scss"

export const Listings = () => {
  const listingData = mockData as Listing[]

  const [selected, setSelected] = useState<number>(0)
  const [limit, setLimit] = useState<number>(2)
  const [searchData, setSearchData] = useState<Array<Listing>>(listingData)
  const [pagedData, setPagedData] = useState<Array<Listing>>(searchData.slice(selected, limit))

  useEffect(() => {
    const timerID = setTimeout(() => {
      const data: Listing[] = []
      searchData.forEach((row: Listing, i: number) => {
        if (i >= selected * limit && i < selected * limit + limit) {
          data.push(row)
        }
      })
      setPagedData(data)
    }, 1000)

    return () => {
      clearTimeout(timerID)
    }
  }, [selected, limit, searchData])

  return (
    <div className={"content"}>
      <div className={"container"}>
        <div className={"filters"}>
          <TextInput
            label={"Search listings by name"}
            placeholder={"Search"}
            className={"name-filter"}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setSelected(0)
              const value = e.target.value
              if (!value) {
                setSearchData(listingData)
              } else {
                setSearchData(filterData(listingData, value))
              }
            }}
          />
          <TextInput
            label={"Items per page"}
            placeholder={limit.toString()}
            className={"items-per-page-filter"}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const value = Number(e.target.value)
              if (value < 1) return

              setLimit(value)
              setSelected(0)
            }}
          />
          <Pagination
            numSteps={limit ? Math.ceil(searchData.length / limit) : 1}
            selected={selected}
            setSelected={setSelected}
          />
        </div>
        <div className={"listings"}>
          {pagedData.map((listing: Listing, index: number) => {
            return (
              <div className="listing" key={index}>
                <ImageBlock
                  imageURL={listing.imageURL}
                  deadline={listing.deadline}
                  labels={listing.imageLabels}
                />
                <InfoBlock
                  title={listing.name}
                  address={listing.address}
                  tableHeader={listing.tableHeader}
                  tableSubheader={listing.tableSubheader}
                  labels={listing.listingLabels}
                  unitRows={listing.unitTableData}
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
