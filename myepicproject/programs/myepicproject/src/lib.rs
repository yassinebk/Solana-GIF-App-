use anchor_lang::prelude::*;

declare_id!("A59NWes8W8oBKHt2zKaU8TN6nra3vn1XEn4x1PYr3CF1");

#[program]
pub mod myepicproject {
    use super::*;
    pub fn start_stuff_off(ctx: Context<StartStuffOff>) -> Result<()> {
        let base_account = &mut ctx.accounts.base_account;
        base_account.total_gifs = 0;
        base_account.votes = vec![];
        base_account.gif_list = vec![];
        Ok(())
    }

    pub fn add_gif(ctx: Context<AddGif>, gif_link: String) -> Result<()> {
        let base_account = &mut ctx.accounts.base_account;
        let user = &mut ctx.accounts.user;

        base_account.total_gifs += 1;
        let item = GifStruct {
            gif_id: base_account.total_gifs,
            gif_link: gif_link.to_string(),
            user_address: *user.to_account_info().key,
        };
        base_account.gif_list.push(item);

        Ok(())
    }

    pub fn remove_gif(ctx: Context<RemoveGif>, gif_id: u32) -> Result<()> {
        let base_account = &mut ctx.accounts.base_account;
        let base_account_imut = base_account.clone();

        base_account.gif_list.remove(
            base_account_imut
                .gif_list
                .iter()
                .position(|x| (*x).gif_id == gif_id)
                .unwrap(),
        );

        base_account_imut
            .votes
            .iter()
            .find(|x| x.gif_id == gif_id)
            .map(|_x| {
                base_account.votes.remove(
                    base_account_imut
                        .votes
                        .iter()
                        .position(|y| y.gif_id == gif_id)
                        .unwrap(),
                );
            });

        Ok(())
    }

    pub fn up_vote(ctx: Context<AddVote>, gif_id: u32) -> Result<()> {
        let base_account = &mut ctx.accounts.base_account;
        let votes_imut = base_account.votes.clone();
        let user_address = ctx.accounts.user.to_account_info().key;
        if !votes_imut.iter().any(|x| {
            (*x).gif_id == gif_id && (*x).user_address == *user_address && (*x).vote_value == 1
        }) {
            votes_imut
                .iter()
                .find(|x| x.gif_id == gif_id && x.user_address == *user_address)
                .map(|x| {
                    if x.vote_value == -1 {
                        base_account
                            .votes
                            .remove(votes_imut.iter().position(|y| y.gif_id == gif_id).unwrap());
                    }
                });

            base_account.votes.push(VoteStruct {
                gif_id: gif_id,
                user_address: *user_address,
                vote_value: 1,
            });
        }
        Ok(())
    }

    pub fn down_vote(ctx: Context<AddVote>, gif_id: u32) -> Result<()> {
        let base_account = &mut ctx.accounts.base_account;
        let user_address = ctx.accounts.user.to_account_info().key;
        let votes_imut = base_account.votes.clone();
        if !votes_imut.iter().any(|x| {
            (*x).gif_id == gif_id && (*x).user_address == *user_address && (*x).vote_value == -1
        }) {
            let vote = VoteStruct {
                gif_id: gif_id,
                user_address: *ctx.accounts.user.to_account_info().key,
                vote_value: -1,
            };

            votes_imut.iter().find(|x| x.gif_id == gif_id).map(|x| {
                if x.vote_value == 1 {
                    base_account
                        .votes
                        .remove(votes_imut.iter().position(|y| y.gif_id == gif_id).unwrap());
                }
            });
            base_account.votes.push(vote);
        }
        Ok(())
    }

    pub fn remove_vote(ctx: Context<RemoveVote>, gif_id: u32) -> Result<()> {
        let base_account = &mut ctx.accounts.base_account;
        let votes_imut = base_account.votes.clone();
        base_account.votes.remove(
            votes_imut
                .iter()
                .position(|x| {
                    (*x).gif_id == gif_id
                        && (*x).user_address == *ctx.accounts.user.to_account_info().key
                })
                .unwrap(),
        );
        Ok(())
    }
}

#[derive(Accounts)]
pub struct StartStuffOff<'info> {
    #[account(init,payer=user,space=160000)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AddGif<'info> {
    #[account(mut)]
    pub base_account: Account<'info, BaseAccount>,

    #[account(mut)]
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct RemoveGif<'info> {
    #[account(mut)]
    pub base_account: Account<'info, BaseAccount>,

    #[account(mut)]
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct AddVote<'info> {
    #[account(mut)]
    pub base_account: Account<'info, BaseAccount>,

    #[account(mut)]
    pub user: Signer<'info>,
}
#[derive(Accounts)]
pub struct RemoveVote<'info> {
    #[account(mut)]
    pub base_account: Account<'info, BaseAccount>,

    #[account(mut)]
    pub user: Signer<'info>,
}

#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct GifStruct {
    pub gif_id: u32,
    pub gif_link: String,
    pub user_address: Pubkey,
}

#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]

pub struct VoteStruct {
    pub user_address: Pubkey,
    pub gif_id: u32,
    pub vote_value: i8,
}

#[account]

pub struct BaseAccount {
    pub total_gifs: u32,
    pub gif_list: Vec<GifStruct>,
    pub votes: Vec<VoteStruct>,
}
