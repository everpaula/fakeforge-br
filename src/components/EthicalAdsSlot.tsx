// EthicalAds — privacy-friendly ads for dev audiences
// https://www.ethicalads.io/
// To activate: sign up, add domain, and the script auto-detects <div data-ea-publisher>
// No env var needed — script is loaded globally in layout.tsx when EthicalAds publisher ID is set.

interface Props {
  type?: "image" | "text" | "image-text";
  style?: "fixedfooter" | "stickybox";
  campaignTypes?: ("paid" | "community" | "house")[];
  className?: string;
}

export default function EthicalAdsSlot({
  type = "image",
  style,
  campaignTypes = ["paid", "community", "house"],
  className = "",
}: Props) {
  const publisher = process.env.NEXT_PUBLIC_ETHICALADS_PUBLISHER;
  if (!publisher) return null;

  return (
    <div
      className={`my-8 ${className}`}
      data-ea-publisher={publisher}
      data-ea-type={type}
      data-ea-style={style}
      data-ea-campaign-types={campaignTypes.join("|")}
    />
  );
}
