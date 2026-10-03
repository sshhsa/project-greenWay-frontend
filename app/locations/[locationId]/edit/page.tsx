import EditLocationForm from '@/components/EditLocationForm/EditLocationForm';

import css from './page.module.css';

type Props = {
  params: Promise<{ locationId: string }>;
};

export default async function EditLocationPage({ params }: Props) {
  const { locationId } = await params;

  return (
    <div className={css.page}>
      <section className={css.headingSection}>
        <div className="container">
          <h1 className={css.title}>Редагування місця</h1>
        </div>
      </section>

      <section className={css.formSection}>
        <div className="container">
          <div className={css.formInner}>
            <EditLocationForm locationId={locationId} />
          </div>
        </div>
      </section>
    </div>
  );
}