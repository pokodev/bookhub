import React, { useEffect, useState } from "react"
import { useOcean, useConsume, usePricing } from "@oceanprotocol/react"
import { Grid, Image, Card, Label, Icon, Button } from "semantic-ui-react"
import { useParams, Link } from "react-router-dom"
import Loader from "react-loader-spinner"
import ReactMarkdown from "react-markdown"
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import "./BookDetails.css"
import Downloader from "./Downloader"

export default function MusicDetails({ config }) {
  const [ddo, setDdo] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDownloading, setIsDownloading] = useState(false)

  let { did } = useParams()
  const { ocean, accountId } = useOcean()
  const { consumeStepText, consume, consumeError } = useConsume()

  useEffect(() => {
    async function getDDO(did) {
      setIsLoading(true)
      try {
        let aquariusUrl = config.metadataCacheUri
        const url = `${aquariusUrl}/api/v1/aquarius/assets/ddo/${did}`

        let encodedUrl = encodeURI(url)
        const response = await fetch(encodedUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          }
        })
        const res = await response.json()
        console.log(res)
        let data = normaliseData(res)
        setDdo(data)
        setIsLoading(false)
      } catch (error) {
        console.log(error)
      }
    }

    getDDO(did)
  }, [])

  function renderLoader() {
    return (
      <div style={{ paddingTop: 200 }}>
        <Loader type="BallTriangle" color="#f3f3f3" height={100} width={100} />
        <h3 style={{ color: "#f3f3f3" }}>Loading eBook Details</h3>
      </div>
    )
  }

  function normaliseData(item) {
    var metadata = item.service[0]
    if (metadata) {
      if (metadata.attributes) {
        var tags = []
        var { name, author } = metadata.attributes.main
        let extra = metadata.attributes.additionalInformation
        if (extra) {
          var description = extra.description
          tags = extra.tags ? extra.tags.splice(0, 2) : []
          var playbackTime = extra.playbackTime
          var posterImage = extra.posterImage
        }

        return {
          name,
          author,
          tags,
          description,
          playbackTime,
          posterImage,
          price: Number(item.price.value).toFixed(2),
          ddo: item,
          did: item.id
        }
      }
    }
  }

  function renderContent() {
    return (
      <div className="detailsContainer">
        <Grid divided="vertically" className="container">
          <Grid.Row centered key={1} columns={2}>
            <Grid.Column width={8}>
              <Card fluid className="cards">
                <Card.Content className="cardContent">
                  <Card.Header>{ddo.name}</Card.Header>
                  <Card.Meta>
                    <span>by {ddo.author}</span>
                  </Card.Meta>
                </Card.Content>
                <Card.Content>
                  <div className="ui two buttons">
                    <Button color="blue" onClick={() => setIsDownloading(true)}>
                      Buy for {ddo.price > 0 ? ddo.price + " $OCEAN" : "FREE"}
                    </Button>
                  </div>
                </Card.Content>

                <Card.Content>
                  <Card.Description>
                    <ReactMarkdown>{ddo.description}</ReactMarkdown>
                  </Card.Description>
                  <Card.Meta style={{ marginTop: 20, fontWeight: 600 }}>
                    Playback Duration :{" "}
                    {ddo.playbackTime ? ddo.playbackTime : "N/A"}
                  </Card.Meta>
                  <Card.Meta style={{ fontWeight: 600 }}>
                    Price : {ddo.price > 0 ? ddo.price + " $OCEAN" : "FREE"}{" "}
                  </Card.Meta>
                </Card.Content>
                {ddo.tags.length ? (
                  <Card.Content extra>
                    {ddo.tags.map(tag => (
                      <Label as="a" color="#A3A3A3" horizontal>
                        {tag}
                      </Label>
                    ))}
                  </Card.Content>
                ) : (
                  ""
                )}
              </Card>
            </Grid.Column>
            <Grid.Column width={4}>
              <Image
                src={
                  ddo.posterImage
                    ? ddo.posterImage
                    : process.env.PUBLIC_URL + "/bookhub-logo.png"
                }
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>

        {isDownloading ? (
          <Downloader showDownloader={setIsDownloading} ddo={ddo.ddo} />
        ) : (
          ""
        )}
      </div>
    )
  }
  return isLoading && !ddo ? renderLoader() : renderContent()
}
