import { Component } from 'react'

import './styles.css';

import { Posts } from '../../components/Posts'
import { loadPosts } from '../../utils/load-posts'
import { Button } from '../../components/Button';
import { TextInput } from '../../components/TextInput';

export class Home extends Component {
  state = {
    posts: [],
    allPosts: [],
    page: 0,
    postsPerPage: 4,
    searchValue: ''
  }

  componentDidMount() {
    this.loadPosts()
  }

  loadPosts = async () => {
    const postsAndPhotos = await loadPosts()
    this.setState((prevState) => {
      return {
        posts: postsAndPhotos.slice(prevState.page, prevState.postsPerPage),
        allPosts: postsAndPhotos
      }
    })
  }

  loadMorePosts = () => {
    this.setState((prevState) => {
      const nextPage = prevState.page + prevState.postsPerPage
      prevState.posts.push(...prevState.allPosts.slice(nextPage, nextPage + prevState.postsPerPage))
      return {
        posts: prevState.posts,
        page: nextPage
      }
    })
  }

  handleChange = (e) => {
    const { value } = e.target
    this.setState({ searchValue: value })
  }

  render() {
    const { posts, allPosts, page, postsPerPage, searchValue } = this.state
    const noMorePosts = page + postsPerPage >= allPosts.length
    const filteredPosts = !!searchValue ? allPosts.filter(post => {
      return post.title.toLowerCase().includes(searchValue.toLowerCase())
    }) : posts

    return (
      <section className="container" >
        <div className="search-container">
          {!!searchValue && (
            <h1> Search value: {searchValue}</h1>
          )}

          <TextInput searchValue={searchValue} handleChange={this.handleChange} />
        </div>

        {filteredPosts.length ?
          <Posts posts={filteredPosts} />
          :
          <p>Não existem posts</p>
        }

        <div className="button-container">
          {!searchValue && (
            <Button
              text="Load more posts"
              onClick={this.loadMorePosts}
              disabled={noMorePosts} />
          )}
        </div>
      </section >
    );
  }
}