/*
 * Exports pre-built footer templates for easy integration into your layout.
 *
 * @remarks
 * Available templates:
 * - {@link SimpleCentered}: Centered footer with navigation and social icons.
 * - {@link SimpleWithSocialLinks}: Compact footer with social icons.
 * - {@link FourColumnWithMission}: Multi-column footer with mission statement and organized links.
 *
 * @example
 * ```tsx
 * import {
 *   SimpleCentered,
 *   SimpleWithSocialLinks,
 *   FourColumnWithMission,
 * } from "./footer-templates";
 *
 * return <SimpleCentered />;
 * ```
 *
 */

export { default as FourColumnWithMission } from "./FourColumnWithMission";
export { default as SimpleCentered } from "./SimpleCentered";
export { default as SimpleWithSocialLinks } from "./SimpleWithSocialLinks";
