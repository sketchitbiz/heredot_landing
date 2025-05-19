// app/terms/[type]/page.tsx

import TermsClient from "./TermsClient";

export default function TermsPage({ params }: { params: { type: string } }) {
  return <TermsClient type={params.type} />;
}
