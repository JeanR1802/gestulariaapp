import React from 'react';
import Image from 'next/image';
import type { BlockComponentProps } from '../editor/blocks/index';
import type { TeamData } from '../editor/blocks/TeamBlock';
import { getBackgroundStyles, getTextStyles } from '../../lib/block-style-helpers';

const TeamPresentational: React.FC<BlockComponentProps<TeamData>> = ({ data }) => {
  const bg = getBackgroundStyles(data.backgroundColor, 'bg-white');
  const titleStyle = getTextStyles(data.titleColor, 'text-slate-800');
  const subtitleStyle = getTextStyles(data.subtitleColor, 'text-slate-600');
  const nameStyle = getTextStyles(data.nameColor, 'text-slate-900');
  const roleStyle = getTextStyles(data.roleColor, 'text-slate-500');
  const members = data.members || [];
  const titleHtml = <h2 className={`text-3xl font-bold text-center ${titleStyle.className}`} style={titleStyle.style as React.CSSProperties}>{data.title}</h2>;
  const subtitleHtml = <p className={`text-lg text-center mt-2 mb-12 max-w-2xl mx-auto ${subtitleStyle.className}`} style={subtitleStyle.style as React.CSSProperties}>{data.subtitle}</p>;

  if (data.variant === 'list') {
    return (
      <div className={`${bg.className} py-12 px-4`} style={bg.style as React.CSSProperties}>
        <div className="max-w-3xl mx-auto">
          {titleHtml}
          {subtitleHtml}
          <div className="space-y-8">
            {members.map((member, i: number) => (
              <div className="flex items-center gap-6" key={i}>
                <Image className="w-20 h-20 rounded-full object-cover shadow-sm" src={member.imageUrl || 'https://placehold.co/100x100'} alt={member.name} width={80} height={80} />
                <div>
                  <h3 className={`font-semibold text-xl ${nameStyle.className}`} style={nameStyle.style as React.CSSProperties}>{member.name}</h3>
                  <p className={`${roleStyle.className}`} style={roleStyle.style as React.CSSProperties}>{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${bg.className} py-12 px-4`} style={bg.style as React.CSSProperties}>
      <div className="max-w-6xl mx-auto text-center">
        {titleHtml}
        {subtitleHtml}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {members.map((member, i: number) => (
            <div key={i}>
              <Image className="w-32 h-32 rounded-full object-cover mx-auto mb-4 shadow-md" src={member.imageUrl || 'https://placehold.co/200x200'} alt={member.name} width={128} height={128} />
              <h3 className={`font-semibold text-lg ${nameStyle.className}`} style={nameStyle.style as React.CSSProperties}>{member.name}</h3>
              <p className={`text-sm ${roleStyle.className}`} style={roleStyle.style as React.CSSProperties}>{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamPresentational;
