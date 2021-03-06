import React, { useState } from "react"
import { Form, Button } from "semantic-ui-react"
import { useOcean, usePublish } from "@oceanprotocol/react"
import { Link } from "react-router-dom"
import "./Publish.css"
import Loader from "react-loader-spinner"
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import Confetti from "react-confetti"

export default function Register({ config }) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [tags, setTags] = useState("")
  const [url, setURL] = useState("")
  const [author, setAuthor] = useState("")
  const [licence, setLicense] = useState("")
  const [posterImage, setPosterImage] = useState("")
  const [playbackTime, setPlaybackTime] = useState("")
  const [showHistory, setShowHistory] = useState(false)

  const { publish, publishStepText, isLoading } = usePublish()
  const { accountId } = useOcean()

  const [ddo, setDdo] = useState(null)
  const [data, setData] = useState(null)

  const asset = {
    main: {
      type: "dataset", //dataset
      name: title,
      dateCreated: new Date(Date.now()).toISOString().split(".")[0] + "Z", // remove milliseconds
      author,
      licence,
      files: [
        {
          url,
          checksum: "efb2c764274b745f5fc37f97c6b0e761",
          encoding: "UTF-8",
          contentLength: "4535431",
          contentType: "image/jpeg",
          compression: "zip"
        }
      ]
    },
    additionalInformation: {
      tags,
      appId: process.env.REACT_APP_DAPP_ID,
      playbackTime,
      posterImage
    }
  }

  async function registerMusic() {
    let ranum = parseInt(Math.random() * 100)
    const priceOptions = {
      price,
      cap: "5000",
      symbol: "POD-" + ranum,
      name: "Fotograh Token " + ranum,
      tokensToMint: "500",
      type: "fixed"
    }

    console.log(asset)

    //   uncomment this below 2 lines
    const ddo = await publish(asset, "access", priceOptions)
    console.log(ddo)
    setDdo(ddo)
  }

  function renderLoader() {
    return (
      <div style={{ paddingTop: 200 }}>
        <Loader type="BallTriangle" color="#f3f3f3" height={100} width={100} />
        <h3>{publishStepText}</h3>
      </div>
    )
  }

  function renderSuccess() {
    return (
      <div style={{ marginTop: 200 }}>
        <Confetti width={4000} height={400} />
        <h3>Your eBook is Published successfully 🎉🎉</h3>
        <Link to="/">
          <Button>Awesome !!</Button>
        </Link>
      </div>
    )
  }

  function renderForm() {
    return (
      <div className="registerContainer">
        <h2 style={{ color: "#f3f3f3" }}>Fill out the ebook details</h2>
        <Form className="registerForm">
          <Form.Field widths="equals">
            <label for="name">Book Title</label>
            <input
              id="name"
              placeholder="eBook Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </Form.Field>
          <Form.Field widths="equals">
            <label for="description">Book Description</label>
            <Form.TextArea
              id="description"
              placeholder="Tell us more about your ebook. Maybe Plot summary or story might help."
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </Form.Field>
          <Form.Field>
            <label for="author">Author</label>
            <input
              id="author"
              placeholder="Jane Austen"
              value={author}
              onChange={e => setAuthor(e.target.value)}
            />
          </Form.Field>
          <Form.Field>
            <label for="price">Price (in OCEAN)</label>
            <input
              id="price"
              placeholder="10"
              value={price}
              onChange={e => setPrice(e.target.value)}
            />
          </Form.Field>
          <Form.Field>
            <label for="url">Book Url</label>
            <input
              id="url"
              placeholder="https://mydrive.com/evetrtrgv.pdf"
              value={url}
              onChange={e => setURL(e.target.value)}
            />
          </Form.Field>
          <Form.Field>
            <label for="cover">Book Cover Image Url</label>
            <input
              id="cover"
              placeholder="https://mydrive.com/book-cover.jpg"
              value={posterImage}
              onChange={e => setPosterImage(e.target.value)}
            />
          </Form.Field>
          <Form.Field>
            <label for="name">Average Reading Time (hours)</label>
            <input
              id="name"
              placeholder="20"
              value={playbackTime}
              onChange={e => setPlaybackTime(e.target.value)}
            />
          </Form.Field>
          <Form.Field>
            <label for="name">Average Reading Time (hours)</label>
            <input
              id="name"
              placeholder="20"
              value={playbackTime}
              onChange={e => setPlaybackTime(e.target.value)}
            />
          </Form.Field>
          <Form.Button color="blue" onClick={e => registerMusic(e)}>
            Publish My eBook
          </Form.Button>
        </Form>
      </div>
    )
  }

  return isLoading ? renderLoader() : ddo ? renderSuccess() : renderForm()
}
