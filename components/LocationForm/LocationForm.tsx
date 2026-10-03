"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { useFormik } from "formik";
import Image from "next/image";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { Button } from "@/components/ui/Button/Button";
import { getCategories } from "@/lib/api/getCategories";
import css from "./LocationForm.module.css";

function classNames(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export type LocationCategoryOption = { label: string; value: string };
export type LocationRegionOption = { label: string; value: string };

export type LocationFormValues = {
  name: string;
  locationType: string;
  description: string;
  image: File | null;
  region: string;
};

const MAX_IMAGE_SIZE = 1024 * 1024;
const SUPPORTED_IMAGE_TYPES = ["image/jpeg", "image/png"];

const emptyLocationFormValues: LocationFormValues = {
  name: "",
  locationType: "",
  description: "",
  image: null,
  region: "",
};

export type LocationFormProps = {
  initialValues?: Partial<Omit<LocationFormValues, "image">> & {
    image?: File | null;
  };
  onSubmit: (values: LocationFormValues) => void | Promise<void>;
  onCancel?: () => void;
};

type ApiLocationType = {
  type: string;
  slug: string;
};

type ApiRegion = {
  region: string;
  slug: string;
};

export function LocationForm({
  initialValues: providedInitialValues,
  onSubmit,
  onCancel,
}: LocationFormProps) {
  const [categories, setCategories] = useState<LocationCategoryOption[]>([]);
  const [regions, setRegions] = useState<LocationRegionOption[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [selectedImagePreviewUrl, setSelectedImagePreviewUrl] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const descriptionTextareaRef = useRef<HTMLTextAreaElement>(null);

  const formInitialValues = useMemo<LocationFormValues>(
    () => ({
      ...emptyLocationFormValues,
      ...providedInitialValues,
      image: providedInitialValues?.image ?? null,
    }),
    [providedInitialValues],
  );

  const locationSchema = useMemo(
    () =>
      Yup.object({
        name: Yup.string()
          .trim()
          .min(3, "Назва має містити щонайменше 3 символи")
          .max(96, "Назва має містити не більше 96 символів")
          .required("Введіть назву місця"),
        locationType: Yup.string()
          .max(64, "Тип місця має містити не більше 64 символів")
          .oneOf(
            categories.map((cat) => cat.value),
            "Оберіть тип місця зі списку",
          )
          .required("Оберіть тип місця"),
        region: Yup.string()
          .oneOf(
            regions.map((reg) => reg.value),
            "Оберіть регіон зі списку",
          )
          .required("Оберіть регіон"),
        description: Yup.string()
          .trim()
          .min(20, "Опис має містити щонайменше 20 символів")
          .max(6000, "Опис має містити не більше 6000 символів")
          .required("Детальний опис локації"),
        image: Yup.mixed<File>()
          .nullable()
          .test("imageRequired", "Додайте фото локації", (file) => file instanceof File)
          .test(
            "fileType",
            "Підтримуються лише JPG або PNG зображення",
            (file) => (file ? SUPPORTED_IMAGE_TYPES.includes(file.type) : true),
          )
          .test("fileSize", "Розмір зображення має бути менше 1 МБ", (file) =>
            file ? file.size < MAX_IMAGE_SIZE : true,
          ),
      }),
    [categories, regions],
  );

  const formik = useFormik<LocationFormValues>({
    initialValues: formInitialValues,
    enableReinitialize: true,
    validationSchema: locationSchema,
    validateOnBlur: true,
    validateOnChange: true,
    validateOnMount: true,
    onSubmit: async (values) => {
      await onSubmit(values);
    },
  });

  const { validateForm } = formik;

  useEffect(() => {
    let isMounted = true;

    async function loadCategories() {
      setIsCategoriesLoading(true);
      setCategoriesError(null);

      try {
        const data = await getCategories();

        if (!isMounted) return;

        if (data && typeof data === "object" && "locationTypes" in data && "regions" in data) {
          const { locationTypes, regions: apiRegions } = data as {
            locationTypes: ApiLocationType[];
            regions: ApiRegion[];
          };

          if (Array.isArray(locationTypes)) {
            setCategories(
              locationTypes.map((cat) => ({
                label: cat.type || cat.slug || "",
                value: cat.slug || "",
              })),
            );
          }

          if (Array.isArray(apiRegions)) {
            setRegions(
              apiRegions.map((reg) => ({
                label: reg.region || reg.slug || "",
                value: reg.slug || "",
              })),
            );
          }
        }
      } catch (error) {
        if (!isMounted) return;

        const message =
          error instanceof Error
            ? error.message
            : "Не вдалося завантажити категорії локацій.";

        setCategoriesError(message);
        toast.error(message);
      } finally {
        if (isMounted) setIsCategoriesLoading(false);
      }
    }

    void loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isCategoriesLoading && !categoriesError) {
      void validateForm();
    }
  }, [categoriesError, isCategoriesLoading, validateForm]);

  useEffect(() => {
    return () => {
      if (selectedImagePreviewUrl) URL.revokeObjectURL(selectedImagePreviewUrl);
    };
  }, [selectedImagePreviewUrl]);

  const isSubmitDisabled = useMemo(
    () =>
      !formik.dirty ||
      !formik.isValid ||
      formik.isSubmitting ||
      isCategoriesLoading ||
      categoriesError !== null,
    [
      categoriesError,
      formik.dirty,
      formik.isSubmitting,
      formik.isValid,
      isCategoriesLoading,
    ],
  );

  const getError = (field: keyof LocationFormValues) =>
    formik.touched[field] && formik.errors[field] ? formik.errors[field] : null;

  const resizeDescriptionTextarea = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 400)}px`;
    textarea.style.overflowY = textarea.scrollHeight > 400 ? "auto" : "hidden";
  };

  useEffect(() => {
    if (descriptionTextareaRef.current) {
      resizeDescriptionTextarea(descriptionTextareaRef.current);
    }
  }, [formik.values.description]);

  const handleDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    formik.handleChange(event);
    resizeDescriptionTextarea(event.currentTarget);
  };

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0] ?? null;

    if (selectedImagePreviewUrl) URL.revokeObjectURL(selectedImagePreviewUrl);

    setSelectedImagePreviewUrl(file ? URL.createObjectURL(file) : null);
    await formik.setFieldValue("image", file, true);
    await formik.setFieldTouched("image", true, true);
  };

  const handleCancel = () => {
    formik.resetForm();
    if (selectedImagePreviewUrl) URL.revokeObjectURL(selectedImagePreviewUrl);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setSelectedImagePreviewUrl(null);
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <form 
      className={css.locationForm} 
      onSubmit={formik.handleSubmit} 
      noValidate 
      aria-busy={isCategoriesLoading || formik.isSubmitting}
    >
      <div className={css.fieldGroup}>
        <p className={css.label} id="location-image-label">
          Обкладинка
        </p>
        
        <div className={css.imagePreview}>
          <Image 
            src={selectedImagePreviewUrl ?? "/placeholder.jpg"} 
            alt={selectedImagePreviewUrl ? "Попередній перегляд фото локації" : "Плейсхолдер фото локації"} 
            fill 
            sizes="(max-width: 767px) 335px, (max-width: 1439px) 704px, 1091px" 
            className={css.previewImage} 
            priority={!selectedImagePreviewUrl} 
            unoptimized={Boolean(selectedImagePreviewUrl)} 
          />
        </div>

        <input 
          id="location-image" 
          name="image" 
          type="file" 
          accept="image/jpeg,image/png"
          className={css.fileInput} 
          ref={fileInputRef} 
          onChange={handleImageChange} 
        />
        <label 
          className={css.uploadButton} 
          htmlFor="location-image" 
          id="location-image-upload-label"
        >
          Завантажити фото
        </label>

        {getError("image") && (
          <p className={css.error}>{String(getError("image"))}</p>
        )}
      </div>

      <div className={css.fieldsGrid}>
        {categoriesError && (
          <p className={css.statusMessage} role="status">
            Не вдалося завантажити категорії локацій. Оновіть сторінку.
          </p>
        )}
        <div className={css.fieldGroup}>
          <label className={css.label} htmlFor="location-name">
            Назва місця
          </label>
          <input 
            id="location-name" 
            type="text" 
            placeholder="Введіть назву місця" 
            className={classNames(css.input, getError("name") && css.inputError)} 
            {...formik.getFieldProps("name")} 
          />
          {getError("name") && (
            <p className={css.error}>{String(getError("name"))}</p>
          )}
        </div>
        <div className={css.fieldGroup}>
          <label className={css.label} htmlFor="location-type">
            Тип місця
          </label>
          <select 
            id="location-type" 
            className={classNames(css.select, getError("locationType") && css.inputError)} 
            {...formik.getFieldProps("locationType")}
          >
            <option value="">Оберіть тип місця</option>
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
        {getError("locationType") && (
          <p className={css.error}>{String(getError("locationType"))}</p>
        )}
      </div>
      <div className={css.fieldGroup}>
        <label className={css.label} htmlFor="location-region">
          Регіон
        </label>
        <select 
          id="location-region" 
          className={classNames(css.select, getError("region") && css.inputError)} 
          {...formik.getFieldProps("region")}
        >
          <option value="">Оберіть регіон</option>
          {regions.map((region) => (
            <option key={region.value} value={region.value}>
              {region.label}
            </option>
          ))}
        </select>
        {getError("region") && (
          <p className={css.error}>{String(getError("region"))}</p>
        )}
      </div>
      <div className={css.fieldGroup}>
        <label className={css.label} htmlFor="location-description">
          Детальний опис
        </label>
        <textarea 
          id="location-description" 
          ref={descriptionTextareaRef} 
          placeholder="Детальний опис локації" 
          className={classNames(css.textarea, getError("description") && css.inputError)} 
          rows={5} 
          name="description"
          value={formik.values.description} 
          onChange={handleDescriptionChange} 
          onBlur={formik.handleBlur} 
        />
        {getError("description") && (
          <p className={css.error}>{String(getError("description"))}</p>
        )}
      </div>
    </div>
<div className={css.formActions}>
  <Button
    type="submit"
    variant="primary"
    disabled={isSubmitDisabled}
    className={css.submitButton}
  >
    {formik.isSubmitting ? "Опублікування..." : "Опублікувати"}
  </Button>
  <Button
    type="button"
    variant="secondary"
    onClick={handleCancel}
    disabled={formik.isSubmitting}
    className={css.cancelButton}
  >
    Відмінити
  </Button>
</div>
</form>
)
}
