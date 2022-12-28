package com.songsociety.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Reply.
 */
@Entity
@Table(name = "reply")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Reply implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Lob
    @Column(name = "content")
    private String content;

    @JsonIgnoreProperties(value = { "user", "spotifyAccount", "profile", "like" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Poster author;

    @ManyToOne
    @JsonIgnoreProperties(value = { "postAuthor", "replies" }, allowSetters = true)
    private Post post;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Reply id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getContent() {
        return this.content;
    }

    public Reply content(String content) {
        this.setContent(content);
        return this;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Poster getAuthor() {
        return this.author;
    }

    public void setAuthor(Poster poster) {
        this.author = poster;
    }

    public Reply author(Poster poster) {
        this.setAuthor(poster);
        return this;
    }

    public Post getPost() {
        return this.post;
    }

    public void setPost(Post post) {
        this.post = post;
    }

    public Reply post(Post post) {
        this.setPost(post);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Reply)) {
            return false;
        }
        return id != null && id.equals(((Reply) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Reply{" +
            "id=" + getId() +
            ", content='" + getContent() + "'" +
            "}";
    }
}
