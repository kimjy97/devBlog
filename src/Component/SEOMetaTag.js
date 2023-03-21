import React from 'react';
import { Helmet } from 'react-helmet-async';

const MetaTag = props => {

  const structuredData = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": props?.title ? props?.title + " - JongYeon's 개발 블로그" : "JongYeon's 개발 블로그",
      "abstract": props?.description ?? "JongYeon의 개발 블로그에 오신것을 환영합니다. 안녕하세요 프론트엔드 개발자 김종연입니다. 개발경험에 있어 여러사람들이 알았으면 하는 정보들을 메모해두고 싶어 직접 풀스택으로 만든 블로그입니다.",
      "commentCount": props?.cmtnum ?? "",
      "datePublished": props?.date ?? "2023-01-01",
      "dateModified": props?.date ?? "2023-01-01",
      "url": props?.url ?? "https://blog.poot97.woobi.co.kr",
      author: {
        "@type": "Person",
        name: "JongYeon",
      }
  }

  return (
    <Helmet>
      <title>{props.title}</title>

      <meta name="description" content={props.description} />
      <meta name="keywords" content={props.keywords} />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={props.title} />
      <meta property="og:site_name" content={props.title} />
      <meta property="og:description" content={props.description} />
      <meta property="og:image" content={props.imgsrc} />
      <meta property="og:url" content={props.url} />

      <meta name="twitter:title" content={props.title} />
      <meta name="twitter:description" content={props.description} />
      <meta name="twitter:image" content={props.imgsrc} />

      <link rel="canonical" href={props.url} />

      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default MetaTag;