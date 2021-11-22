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
    const { page, postsPerPage } = this.state
    const postsAndPhotos = await loadPosts()
    this.setState({
      posts: postsAndPhotos.slice(page, postsPerPage),
      allPosts: postsAndPhotos
    })
  }

  loadMorePosts = () => {
    const { posts, allPosts, page, postsPerPage } = this.state
    const nextPage = page + postsPerPage
    posts.push(...allPosts.slice(nextPage, nextPage + postsPerPage))
    this.setState({ posts, page: nextPage })
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