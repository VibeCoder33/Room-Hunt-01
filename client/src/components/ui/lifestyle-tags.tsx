import { Badge } from "@/components/ui/badge";

interface LifestyleTag {
  key: string;
  value: string;
  label: string;
}

interface LifestyleTagsProps {
  tags: LifestyleTag[];
  maxTags?: number;
}

export function LifestyleTags({ tags, maxTags = 3 }: LifestyleTagsProps) {
  const displayTags = tags.slice(0, maxTags);
  const remainingCount = tags.length - maxTags;

  const getTagVariant = (key: string) => {
    const variants: Record<string, string> = {
      sleepSchedule: "lifestyle-tag-sleep",
      dietaryPreference: "lifestyle-tag-diet",
      smoking: "lifestyle-tag-smoking",
      workSchedule: "lifestyle-tag-work",
      cleanliness: "lifestyle-tag-clean",
    };
    return variants[key] || "secondary";
  };

  const formatLabel = (key: string, value: string) => {
    const formatMap: Record<string, Record<string, string>> = {
      sleepSchedule: {
        early_bird: "Early Bird",
        night_owl: "Night Owl",
        flexible: "Flexible",
      },
      dietaryPreference: {
        vegetarian: "Vegetarian",
        non_vegetarian: "Non-Veg",
        vegan: "Vegan",
        no_preference: "Any Diet",
      },
      smoking: {
        non_smoker: "Non-Smoker",
        occasional_smoker: "Occasional",
        regular_smoker: "Smoker",
      },
      workSchedule: {
        regular_office: "Office",
        remote_work: "Remote",
        night_shift: "Night Shift",
        student: "Student",
      },
      cleanliness: {
        very_clean: "Very Clean",
        clean_flexible: "Clean",
        moderately_clean: "Moderate",
        relaxed: "Relaxed",
      },
    };

    return formatMap[key]?.[value] || value;
  };

  return (
    <div className="flex flex-wrap gap-1">
      {displayTags.map((tag, index) => (
        <Badge
          key={index}
          variant="secondary"
          className={`text-xs ${getTagVariant(tag.key)}`}
        >
          {formatLabel(tag.key, tag.value)}
        </Badge>
      ))}
      {remainingCount > 0 && (
        <Badge variant="outline" className="text-xs">
          +{remainingCount} more
        </Badge>
      )}
    </div>
  );
}

interface ProfileTagsProps {
  profile: any;
}

export function ProfileTags({ profile }: ProfileTagsProps) {
  const tags: LifestyleTag[] = [];

  if (profile.sleepSchedule) {
    tags.push({ key: "sleepSchedule", value: profile.sleepSchedule, label: profile.sleepSchedule });
  }
  if (profile.dietaryPreference) {
    tags.push({ key: "dietaryPreference", value: profile.dietaryPreference, label: profile.dietaryPreference });
  }
  if (profile.smoking) {
    tags.push({ key: "smoking", value: profile.smoking, label: profile.smoking });
  }
  if (profile.workSchedule) {
    tags.push({ key: "workSchedule", value: profile.workSchedule, label: profile.workSchedule });
  }
  if (profile.cleanliness) {
    tags.push({ key: "cleanliness", value: profile.cleanliness, label: profile.cleanliness });
  }

  return <LifestyleTags tags={tags} />;
}
