import React from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Pagination from 'react-bootstrap/Pagination'
import Row from 'react-bootstrap/Row'
import './app.scss'

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      data_url: 'http://nyx.vima.ekt.gr:3000/api/books',
      data: [],
      data_count: 0,
      filters: [],
      itemsPerPage: 20,
      page: 1
    }
  }

  componentDidMount() {
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    const page = (urlParams.has('page')) ? parseInt(urlParams.get('page')) : this.state.page;

    this.postData(this.state.data_url, { page: page, itemsPerPage: this.state.itemsPerPage, filters: this.state.filters })
      .then(data => {
        this.setState({
          data: data.books,
          data_count: data.count,
          page: page
        })
      })
  }

  async postData(url = '', data ={}) {
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data)
    })
    return response.json()
  }

  setPage(e, number) {
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    urlParams.set('page', number)
    urlParams.toString()
    window.history.pushState({}, '', '?' + urlParams)

    this.postData(this.state.data_url, {page: number, itemsPerPage: this.state.itemsPerPage, filters: this.state.filters})
      .then(data => {
        this.setState({
          data: data.books,
          page: number
        })
      })
  }

  render() {
    let active = this.state.page
    let items = []
    let pages = Math.ceil(this.state.data_count / this.state.itemsPerPage)
    for (let number = 1; number <= pages; number++) {
      items.push(
        <Pagination.Item key={number} active={number === active} onClick={(e) => this.setPage(e, number)}>
          {number}
        </Pagination.Item>,
      )
    }

    return (
      <Container className="component-app">
        <Row>
          <Col>
            <ListGroup>
              {this.state.data.map(el => (
                <ListGroup.Item key={el.id}>
                  {el.book_title}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
        </Row>

        <Row className="justify-content-md-center">
          <Col md="auto">
            <Pagination>
              <Pagination.First onClick={(e) => this.setPage(e, 1)}/>
              <Pagination.Prev onClick={(e) => this.setPage(e, this.state.page - 1)}/>
              {items}
              <Pagination.Next onClick={(e) => this.setPage(e, this.state.page + 1)}/>
              <Pagination.Last onClick={(e) => this.setPage(e, pages)}/>
            </Pagination>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default App
