package com.songsociety.repository;

import com.songsociety.domain.Post;
import java.util.Optional;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Post entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    @Query("SELECT p.societyTag FROM Poster p WHERE p.id = (SELECT post.postAuthor FROM Post post WHERE post.id = :postId)")
    Optional<String> findPostAuthorTag(@Param("postId") Long postId);
}
