// Форма локації (фото з прев'ю, назва, тип, регіон, опис). Лише для створення
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import * as Yup from "yup";
import type { ButtonHTMLAttributes, HTMLAttributes } from "react";
import css from "./LocationForm.module.css";

type LocationInputWithMapProps = {
  location: string;
  setLocation: (value: string) => void;
  onCoordinatesChange: (
    coordinates: { lat: number; lon: number } | null,
  ) => void;
  initialCoordinates?: { lat: number; lon: number } | null;
};

function LocationInputWithMap({
  location,
  setLocation,
  onCoordinatesChange,
  initialCoordinates,
}: LocationInputWithMapProps) {
  return (
    <input
      type="text"
      value={location}
      onChange={(event) => {
        setLocation(event.target.value);
        onCoordinatesChange(initialCoordinates ?? null);
      }}
      placeholder="Введіть адресу місця"
      aria-label="Адреса місця"
      className={css.input}
    />
  );
}

function classNames(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

type LoaderProps = HTMLAttributes<HTMLSpanElement> & {
  overlay?: boolean;
  size?: "sm" | "lg";
  variant?: "white";
};

function Loader({ overlay, size, variant, className, ...props }: LoaderProps) {
  return (
    <span
      className={classNames(
        className,
        overlay && css.loaderOverlay,
        size === "sm" && css.loaderSmall,
        size === "lg" && css.loaderLarge,
        variant === "white" && css.loaderWhite,
      )}
      {...props}
    />
  );
}

function AppButton({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={className} {...props} />;
}

type LocationCategoryOption = { label: string; value: string };
type LocationTypeResponse = { type: string; slug: string };
type RegionResponse = {
  region?: string;
  name?: string;
  type?: string;
  slug: string;
};

async function requestLocationsApi<T>(
  endpoint: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(endpoint, init);
  if (!response.ok) {
    throw new Error("Не вдалося виконати запит. Спробуйте ще раз.");
  }
  return response.json() as Promise<T>;
}

const getLocationTypes = () =>
  requestLocationsApi<LocationTypeResponse[]>("/api/locations/types");

const getRegions = () =>
  requestLocationsApi<RegionResponse[]>("/api/locations/regions");

async function createLocation(
  values: LocationFormValues & { image: File },
): Promise<{ _id: string }> {
  const body = new FormData();

  Object.entries(values).forEach(([key, value]) => {
    if (value instanceof File) {
      body.append(key, value);
    } else if (value !== null && value !== undefined) {
      body.append(key, typeof value === "object" ? JSON.stringify(value) : value);
    }
  });

  return requestLocationsApi<{ _id: string }>("/api/locations", {
    method: "POST",
    body,
  });
}

export type LocationFormValues = {
  name: string;
  locationType: string;
  region: string;
  description: string;
  image: File | null;
  address?: string;
  coordinates?: {
    lat: number;
    lon: number;
  } | null;
};

const MAX_IMAGE_SIZE = 1024 * 1024;
const SUPPORTED_IMAGE_TYPES = ["image/jpeg", "image/png"];

const emptyLocationFormValues: LocationFormValues = {
  name: "",
  locationType: "",
  region: "",
  description: "",
  image: null,
  address: "",
  coordinates: null,
};

export type LocationFormProps = {
  initialValues?: Partial<Omit<LocationFormValues, "image">> & {
    image?: File | null;
  };
  onCancel?: () => void;
};

export function LocationForm({
  initialValues: providedInitialValues,
  onCancel,
}: LocationFormProps = {}) {
  const router = useRouter();
  const [locationTypes, setLocationTypes] = useState<LocationCategoryOption[]>(
    [],
  );
  const [regions, setRegions] = useState<LocationCategoryOption[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [selectedImagePreviewUrl, setSelectedImagePreviewUrl] = useState<
    string | null
  >(null);
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
          .required("Вкажіть назву місця"),
        locationType: Yup.string()
          .max(64, "Тип місця має містити не більше 64 символів")
          .oneOf(
            locationTypes.map((type) => type.value),
            "Оберіть тип місця зі списку",
          )
          .required("Оберіть тип місця"),
        region: Yup.string()
          .max(64, "Регіон має містити не більше 64 символів")
          .oneOf(
            regions.map((region) => region.value),
            "Оберіть регіон зі списку",
          )
          .required("Оберіть регіон"),
        address: Yup.string().trim().required("Вкажіть адресу місця"),
        coordinates: Yup.object()
          .shape({
            lat: Yup.number().required(),
            lon: Yup.number().required(),
          })
          .nullable()
          .required("Оберіть місце на карті або знайдіть його за адресою"),
        description: Yup.string()
          .trim()
          .min(20, "Опис має містити щонайменше 20 символів")
          .max(6000, "Опис має містити не більше 6000 символів")
          .required("Додайте детальний опис"),
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
    [locationTypes, regions],
  );


 const formik = useFormik<LocationFormValues>({
    initialValues: formInitialValues,
    enableReinitialize: true,
    validationSchema: locationSchema,
    validateOnBlur: true,
    validateOnChange: true,
    validateOnMount: true,
    onSubmit: async (values) => {
      try {
        const submitValues = { ...values };
        delete submitValues.address;

        if (!values.image) {
          throw new Error("Додайте фото локації");
        }

        const createdLocation = await createLocation({
          ...submitValues,
          image: values.image,
        });
        
        toast.success("Локацію успішно опубліковано");
        router.push(`/locations/${createdLocation._id}`);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Не вдалося опублікувати локацію. Спробуйте ще раз.",
        );
      }
    },
  });

  const { validateForm } = formik;

  useEffect(() => {
    let isMounted = true;

    async function loadCategories() {
      setIsCategoriesLoading(true);
      setCategoriesError(null);

      try {
        const [types, regionOptions] = await Promise.all([
          getLocationTypes(),
          getRegions(),
        ]);

        if (!isMounted) return;

        setLocationTypes(
          types.map((type) => ({ label: type.type, value: type.slug })),
        );
        setRegions(
          regionOptions.map((region) => ({
            label: region.region ?? region.name ?? region.type ?? region.slug,
            value: region.slug,
          })),
        );
      } catch (error) {
        if (!isMounted) return;

        const message =
          error instanceof Error
            ? error.message
            : "Не вдалося завантажити списки типів місць і регіонів.";

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoriesError, isCategoriesLoading]);

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
      className={css.form}
      onSubmit={formik.handleSubmit}
      noValidate
      aria-busy={isCategoriesLoading || formik.isSubmitting}
    >
      {isCategoriesLoading && <Loader overlay size="lg" />}
      <div className={css.fieldGroup}>
        <p className={css.label} id="location-image-label">
          Обкладинка
        </p>
        <div className={css.imagePreview}>
          <Image
            src={
              selectedImagePreviewUrl ?? "/placeholder.jpg"
            }
            alt={
              selectedImagePreviewUrl
                ? "Попередній перегляд фото локації"
                : "Плейсхолдер фото локації"
            }
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
          <p className={css.error}>{getError("image") as string}</p>
        )}
      </div>

      <div className={css.fieldsGrid}>
        {categoriesError && (
          <p className={css.statusMessage} role="status">
            Не вдалося завантажити типи місць і регіони. Оновіть сторінку.
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
            className={classNames(
              css.input,
              getError("name") && css.inputError,
            )}
            {...formik.getFieldProps("name")}
          />
          {getError("name") && <p className={css.error}>{getError("name")}</p>}
        </div>

        <div className={css.fieldGroup}>
          <label className={css.label} htmlFor="location-type">
            Тип місця
          </label>
          <div className={css.selectWrapper}>
            <select
              id="location-type"
              className={classNames(
                css.input,
                !formik.values.locationType && css.placeholderSelect,
                getError("locationType") && css.selectError,
              )}
              disabled={isCategoriesLoading || categoriesError !== null}
              {...formik.getFieldProps("locationType")}
            >
              <option value="" disabled hidden>
                {isCategoriesLoading
                  ? "Завантажуємо типи..."
                  : "Оберіть тип місця"}
              </option>
              {locationTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <svg className={css.selectArrow} aria-hidden="true">
              <use href="/sprite.svg#arrow-down" />
            </svg>
          </div>
          {getError("locationType") && (
            <p className={css.error}>{getError("locationType")}</p>
          )}
        </div>

        <div className={css.fieldGroup}>
          <label className={css.label} htmlFor="location-region">
            Регіон
          </label>
          <div className={css.selectWrapper}>
            <select
              id="location-region"
              className={classNames(
                css.input,
                !formik.values.region && css.placeholderSelect,
                getError("region") && css.selectError,
              )}
              disabled={isCategoriesLoading || categoriesError !== null}
              {...formik.getFieldProps("region")}
            >
              <option value="" disabled hidden>
                {isCategoriesLoading
                  ? "Завантажуємо регіони..."
                  : "Оберіть регіон"}
              </option>
              {regions.map((region) => (
                <option key={region.value} value={region.value}>
                  {region.label}
                </option>
              ))}
            </select>
            <svg className={css.selectArrow} aria-hidden="true">
              <use href="/sprite.svg#arrow-down" />
            </svg>
          </div>
          {getError("region") && <p className={css.error}>{getError("region")}</p>}
        </div>

        <div className={css.fieldGroup}>
          <label className={css.label}>Адреса та розташування на карті</label>
          <LocationInputWithMap
            location={formik.values.address || ""}
            setLocation={(value) => {
              if (formik.values.address !== value) {
                formik.setFieldValue("address", value);
              }
            }}
            onCoordinatesChange={(coords) => {
              const newLat = coords?.lat ?? null;
              const newLon = coords?.lon ?? null;
              const currentCoordinates = formik.values.coordinates;
              const currentLat = currentCoordinates?.lat ?? null;
              const currentLon = currentCoordinates?.lon ?? null;

              if (currentLat !== newLat || currentLon !== newLon) {
                formik.setFieldValue(
                  "coordinates",
                  coords ? { lat: newLat, lon: newLon } : null,
                );
              }
            }}
          />
          {getError("coordinates") && (
            <p className={css.error}>{getError("coordinates") as string}</p>
          )}
        </div>

        <div className={css.fieldGroup}>
          <label className={css.label} htmlFor="location-description">
            Детальний опис
          </label>
          <textarea
            id="location-description"
            placeholder="Детальний опис локації"
            className={classNames(
              css.input,
              css.textarea,
              getError("description") && css.inputError,
            )}
            {...formik.getFieldProps("description")}
            ref={descriptionTextareaRef}
            onChange={handleDescriptionChange}
          />
          {getError("description") && (
            <p className={css.error}>{getError("description")}</p>
          )}
        </div>
      </div>

      <div className={css.actions}>
        <AppButton
          className={css.actionButton}
          type="submit"
          disabled={isSubmitDisabled}
        >
          {formik.isSubmitting ? (
            <span className={css.buttonLoaderContent}>
              <Loader size="sm" variant="white" />
              Публікуємо...
            </span>
          ) : (
            "Опублікувати"
          )}
        </AppButton>
        <AppButton
          className={css.actionButton}
          type="button"
          onClick={handleCancel}
          disabled={formik.isSubmitting}
        >
          Відмінити
        </AppButton>
      </div>
    </form>
  );
}
