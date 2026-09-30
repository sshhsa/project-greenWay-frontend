"use client";

import Image from "next/image";
import Button from "./Button";

export default function ButtonTest() {
  return (
    <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
      <Button variant="primary" size="large">
        Увійти
      </Button>

      <Button variant="secondary" size="large">
        Скасувати
      </Button>

      <Button variant="primary" size="small">
        Увійти
      </Button>

      <Button variant="secondary" size="small">
        Скасувати
      </Button>

      <Button variant="primary" size="large" disabled>
        Увійти
      </Button>

      <Button variant="secondary" size="large" disabled>
        Скасувати
      </Button>

      <Button variant="primary" size="small" disabled>
        Увійти
      </Button>

      <Button variant="secondary" size="small" disabled>
        Скасувати
      </Button>

      <Button variant="primary" size="iconOnly">
        <Image
          src="/icons/bookmark.svg"
          alt="Закладки"
          width={24}
          height={24}
        />
      </Button>

      <Button variant="secondary" size="iconOnly">
        <Image
          src="/icons/bookmark.svg"
          alt="Закладки"
          width={24}
          height={24}
        />
      </Button>

      <Button variant="primary" size="iconOnlySmall">
        <Image
          src="/icons/bookmark.svg"
          alt="Закладки"
          width={24}
          height={24}
        />
      </Button>

      <Button variant="secondary" size="iconOnlySmall">
        <Image
          src="/icons/bookmark.svg"
          alt="Закладки"
          width={24}
          height={24}
        />
      </Button>
    </div>
  );
}