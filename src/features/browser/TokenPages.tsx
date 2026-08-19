import { Card } from '../../components/primitives/Card';
import { Label, Text } from '../../components/primitives/Text';
import {
  colorData,
  colorInk,
  colorSemantic,
  accuracyRamp,
  colorSurface,
  colorUtility,
  duration,
  easing,
  elevation,
  radius,
  space,
  textStyle,
  type TextStyleName,
} from '../../tokens';
import { BrowserSection, Specimen, SpecimenGrid } from './BrowserPage';

/* ============================================================
   TOKEN SPECIMENS

   Each page is a grid of specimens: the shape itself, then its
   NAME and its VALUE stacked in small mono underneath. Everything
   is read from src/tokens — there is no second copy of any value
   anywhere on these pages.
   ============================================================ */

const swatches = (group: Record<string, string>) =>
  Object.entries(group).map(([name, value]) => (
    <Specimen key={name} name={name} value={value} background={value} />
  ));

export function ColorsPage() {
  return (
    <>
      <BrowserSection title="Surface — four values. A card and the page share a fill; elevation does the separating.">
        <SpecimenGrid>{swatches(colorSurface)}</SpecimenGrid>
      </BrowserSection>
      <BrowserSection title="Ink — four values. Every numeral uses primary now.">
        <SpecimenGrid>{swatches(colorInk)}</SpecimenGrid>
      </BrowserSection>
      <BrowserSection title="Data — the AERA palette. Five hues, nothing outside them.">
        <SpecimenGrid>{swatches(colorData)}</SpecimenGrid>
      </BrowserSection>
      <BrowserSection title="Semantic — green good, orange bad, yellow between. Global rule.">
        <SpecimenGrid>{swatches(colorSemantic)}</SpecimenGrid>
      </BrowserSection>
      <BrowserSection title="Accuracy — three ordered stops, and they are the semantic ones">
        <SpecimenGrid>
          {swatches(Object.fromEntries(accuracyRamp.map((stop) => [stop.name, stop.color])))}
        </SpecimenGrid>
      </BrowserSection>
      <BrowserSection title="Utility — the functional colours that are not part of the scale">
        <SpecimenGrid>{swatches(colorUtility)}</SpecimenGrid>
      </BrowserSection>
    </>
  );
}

export function RadiiPage() {
  return (
    <BrowserSection title="Seven corners. Panel and shell folded into card; xxs folded into xs.">
      <SpecimenGrid>
        {Object.entries(radius).map(([name, value]) => (
          <Specimen key={name} name={name} value={value} background={colorData.lilac} radius={value} />
        ))}
      </SpecimenGrid>
    </BrowserSection>
  );
}

const TYPE_ORDER = Object.keys(textStyle) as TextStyleName[];

export function TypePage() {
  return (
    <BrowserSection title="Eight composed tokens. The two label sizes, the tick and the old mono are one `mono` now.">
      <SpecimenGrid min="320px">
        {TYPE_ORDER.map((name) => {
          const style = textStyle[name] as Record<string, string | number>;
          return (
            <Specimen
              key={name}
              name={name}
              value={`${style.fontSize} / ${style.lineHeight} · ${style.fontWeight}`}
            >
              <Text variant={name} tone="primary">
                Aa jump shot 0123
              </Text>
            </Specimen>
          );
        })}
      </SpecimenGrid>
    </BrowserSection>
  );
}

export function SpacingPage() {
  return (
    <BrowserSection title="One scale. Components pick a step; they never write a pixel.">
      <SpecimenGrid min="132px">
        {Object.entries(space).map(([step, value]) => (
          <Specimen key={step} name={`space-${step}`} value={value}>
            <div style={{ display: 'flex', alignItems: 'flex-end', height: 'var(--aera-space-16)' }}>
              <span
                style={{
                  display: 'block',
                  width: value,
                  height: value,
                  minWidth: '2px',
                  minHeight: '2px',
                  borderRadius: 'var(--aera-radius-xs)',
                  background: colorData.mint,
                }}
              />
            </div>
          </Specimen>
        ))}
      </SpecimenGrid>
    </BrowserSection>
  );
}

export function ElevationPage() {
  return (
    <BrowserSection title="The only thing separating a card from the paper. Always on the element carrying the radius.">
      <SpecimenGrid min="220px">
        {Object.entries(elevation).map(([name, value]) => (
          <Specimen key={name} name={name} value={value.length > 46 ? `${value.slice(0, 46)}…` : value}>
            <Card radius="lg" elevation={name as keyof typeof elevation} padding="10">
              <Label tone="tertiary">{name}</Label>
            </Card>
          </Specimen>
        ))}
      </SpecimenGrid>
    </BrowserSection>
  );
}

export function MotionPage() {
  return (
    <>
      <BrowserSection title="Duration">
        <SpecimenGrid min="132px">
          {Object.entries(duration).map(([name, value]) => (
            <Specimen key={name} name={name} value={value} background={colorData.blue} />
          ))}
        </SpecimenGrid>
      </BrowserSection>
      <BrowserSection title="Easing — everything decelerates into place, and nothing overshoots">
        <SpecimenGrid min="220px">
          {Object.entries(easing).map(([name, value]) => (
            <Specimen key={name} name={name} value={value}>
              <div
                style={{
                  height: 'var(--aera-space-16)',
                  borderRadius: 'var(--aera-radius-md)',
                  background: colorData.yellow,
                  transitionTimingFunction: value,
                }}
              />
            </Specimen>
          ))}
        </SpecimenGrid>
      </BrowserSection>
    </>
  );
}
