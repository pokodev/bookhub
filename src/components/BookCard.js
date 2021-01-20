import React from "react"
import { Card, Icon, Image, Label } from "semantic-ui-react"
import { Link } from "react-router-dom"
import "./BookCard.css"

export default function MusicCard({
  imageSrc,
  title,
  author,
  playtime,
  did,
  price,
  tags
}) {
  return (
    <Link to={"/asset/" + did}>
      <Card fluid className="cards">
        <Image src={imageSrc} wrapped ui={false} />
        <Card.Content className="cardContent">
          <Card.Header>{title}</Card.Header>
          <Card.Meta>
            <span>{author}</span>
          </Card.Meta>
          <Card.Description>
            {tags.map(tag => (
              <Label as="a" color="#A3A3A3" horizontal>
                {tag}
              </Label>
            ))}
          </Card.Description>
        </Card.Content>
      </Card>
    </Link>
  )
}
