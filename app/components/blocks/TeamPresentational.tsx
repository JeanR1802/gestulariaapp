import React from 'react';
import type { BlockComponentProps } from '../editor/blocks/index';

const TeamPresentational: React.FC<BlockComponentProps<any>> = ({ data }) => {
  const members = data.members || [];
  const titleHtml = <h2 className={`text-3xl font-bold text-center ${data.titleColor || 'text-slate-800'}`}>{data.title}</h2>;
  const subtitleHtml = <p className={`text-lg text-center mt-2 mb-12 max-w-2xl mx-auto ${data.subtitleColor || 'text-slate-600'}`}>{data.subtitle}</p>;

  if (data.variant === 'list') {
    return (
      <div className={`${data.backgroundColor || 'bg-white'} py-12 px-4`}>
        <div className="max-w-3xl mx-auto">
          {titleHtml}
          {subtitleHtml}
          <div className="space-y-8">
            {members.map((member: any, i: number) => (
              <div className="flex items-center gap-6" key={i}>
                <img className="w-20 h-20 rounded-full object-cover shadow-sm" src={member.imageUrl || 'https://placehold.co/100x100'} alt={member.name} />
                <div>
                  <h3 className={`font-semibold text-xl ${data.nameColor || 'text-slate-900'}`}>{member.name}</h3>
                  <p className={`${data.roleColor || 'text-slate-500'}`}>{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${data.backgroundColor || 'bg-white'} py-12 px-4`}>
      <div className="max-w-6xl mx-auto text-center">
        {titleHtml}
        {subtitleHtml}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {members.map((member: any, i: number) => (
            <div key={i}>
              <img className="w-32 h-32 rounded-full object-cover mx-auto mb-4 shadow-md" src={member.imageUrl || 'https://placehold.co/200x200'} alt={member.name} />
              <h3 className={`font-semibold text-lg ${data.nameColor || 'text-slate-900'}`}>{member.name}</h3>
              <p className={`text-sm ${data.roleColor || 'text-slate-500'}`}>{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamPresentational;
