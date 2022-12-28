package com.songsociety.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Post.
 */
@Entity
@Table(name = "post")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Post implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "date", nullable = false)
    private ZonedDateTime date;

    @Lob
    @Column(name = "content", nullable = false)
    private String content;

    @ManyToOne
    @JsonIgnoreProperties(value = { "user", "spotifyAccount", "profile", "like" }, allowSetters = true)
    private Poster postAuthor;

    @OneToMany(mappedBy = "post")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "author", "post" }, allowSetters = true)
    private Set<Reply> replies = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Post id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ZonedDateTime getDate() {
        return this.date;
    }

    public Post date(ZonedDateTime date) {
        this.setDate(date);
        return this;
    }

    public void setDate(ZonedDateTime date) {
        this.date = date;
    }

    public String getContent() {
        return this.content;
    }

    public Post content(String content) {
        this.setContent(content);
        return this;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Poster getPostAuthor() {
        return this.postAuthor;
    }

    public void setPostAuthor(Poster poster) {
        this.postAuthor = poster;
    }

    public Post postAuthor(Poster poster) {
        this.setPostAuthor(poster);
        return this;
    }

    public Set<Reply> getReplies() {
        return this.replies;
    }

    public void setReplies(Set<Reply> replies) {
        if (this.replies != null) {
            this.replies.forEach(i -> i.setPost(null));
        }
        if (replies != null) {
            replies.forEach(i -> i.setPost(this));
        }
        this.replies = replies;
    }

    public Post replies(Set<Reply> replies) {
        this.setReplies(replies);
        return this;
    }

    public Post addReply(Reply reply) {
        this.replies.add(reply);
        reply.setPost(this);
        return this;
    }

    public Post removeReply(Reply reply) {
        this.replies.remove(reply);
        reply.setPost(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Post)) {
            return false;
        }
        return id != null && id.equals(((Post) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Post{" +
            "id=" + getId() +
            ", date='" + getDate() + "'" +
            ", content='" + getContent() + "'" +
            "}";
    }
}
