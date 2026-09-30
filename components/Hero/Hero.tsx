"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button as AppButton } from "@/components/ui/Button/Button";
import css from "./Hero.module.css";

export default function Hero() {
  const [query, setQuery] = useState(""); 
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    
    if (!trimmedQuery) {
      router.push("/locations");
      return;
    }
    
    const params = new URLSearchParams();
    params.set("search", trimmedQuery);
    
    router.push(`/locations?${params.toString()}`);
  };

  return (
    <section className={css.hero}>
      <video 
        autoPlay 
        muted 
        loop 
        playsInline 
        preload="auto"
        poster="/Hero.jpg" 
        className={css.bgImage}
      >
        <source src="/Hero-video.mp4" type="video/mp4" />
        Ваш браузер не підтримує відтворення відео.
      </video>
      <div className={css.overlay} aria-hidden="true" />
      
      <div className={css.container}>
        <h1 className={css.title}>
          Відкрий для себе Україну. Знайди ідеальне місце для відпочинку
        </h1>
        <p className={css.subtitle}>
          Тисячі перевірених локацій з реальними фото та відгуками від мандрівників.
        </p>
        
        <form onSubmit={handleSubmit} className={css.searchForm}>
          <input 
            className={css.searchInput} 
            autoComplete="off" 
            type="text" 
            name="query" 
            value={query} 
            onChange={(e) => setQuery(e.target.value)} 
            placeholder="Введіть назву, тип або регіон..." 
            aria-label="Введіть назву, тип або регіон" 
          />
          <AppButton 
            className={css.searchButton} 
            type="submit" 
            aria-label="Знайти місце"
          >
            Знайти місце
          </AppButton>
        </form>
      </div>
    </section>
  );
}
