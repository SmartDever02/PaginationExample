import { useEffect, useState } from "react"

// components
import ImageBlock from "./components/ImageBlock"
import TextInput from "./components/TextInput"
import Pagination from "./components/Pagination"
import InfoBlock from "./components/InfoBlock"

import mockData from "./mock-data.json"

import "./Listings.scss"

export const Listings = () => {
  const listingData = mockData as Listing[]

  const [selected, setSelected] = useState(0)
  const [limit, setLimit] = useState(2)
  const [searchData, setSearchData] = useState<Array<Listing>>(listingData)
  const [pagedData, setPagedData] = useState<Array<Listing>>(searchData.slice(selected, limit))

  useEffect(() => {
    const data: Listing[] = []
    searchData.forEach((row, i) => {
      if (i >= selected * limit && i < selected * limit + limit) {
        data.push(row)
      }
    })
    setPagedData(data)
  }, [selected, limit, searchData])

  return (
    <div className={"content"}>
      <div className={"container"}>
        <div className={"filters"}>
          <TextInput
            label={"Search listings by name"}
            placeholder={"Search"}
            className={"name-filter"}
            onChange={(e) => {
              setSelected(0)
              const value = e.target.value
              if (!value) {
                setSearchData(listingData)
              } else {
                setSearchData(
                  listingData.filter(
                    (item) =>
                      item.name.includes(value) ||
                      item.tableHeader?.includes(value) ||
                      item.tableSubheader?.includes(value)
                  )
                )
              }
            }}
          />
          <TextInput
            label={"Items per page"}
            placeholder={limit.toString()}
            className={"items-per-page-filter"}
            onChange={(e) => {
              const value = e.target.value
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
          {pagedData.map((listing, index) => {
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
